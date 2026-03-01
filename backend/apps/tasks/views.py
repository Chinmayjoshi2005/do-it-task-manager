from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Q
from datetime import date, timedelta
import json
from .models import Task
from .serializers import TaskSerializer, TaskReorderSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Task.objects.filter(user=self.request.user)
        filter_type = self.request.query_params.get('filter', 'all')
        today = date.today()

        if filter_type == 'today':
            qs = qs.filter(due_date=today)
        elif filter_type == 'upcoming':
            qs = qs.filter(due_date__gt=today, completed=False)
        elif filter_type == 'completed':
            qs = qs.filter(completed=True)
        elif filter_type == 'pending':
            qs = qs.filter(completed=False)

        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(completed=False, completed_at=None, status='pending')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Task deleted successfully.'}, status=status.HTTP_200_OK)


class CompletedTasksView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user, completed=True).order_by('-completed_at')


class ToggleTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            task = Task.objects.get(pk=pk, user=request.user)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)

        task.completed = not task.completed
        if task.completed:
            task.completed_at = timezone.now()
            task.status = 'completed'
        else:
            task.completed_at = None
            task.status = 'pending'
        task.save()
        return Response(TaskSerializer(task).data)


class StreakDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        year = request.query_params.get('year', 'Recent')
        
        if year != 'Recent':
            try:
                yr = int(year)
                start_date = date(yr, 1, 1)
                end_date = date(yr, 12, 31)
                num_days = (end_date - start_date).days + 1
            except ValueError:
                end_date = date.today()
                start_date = end_date - timedelta(days=364)
                num_days = 365
        else:
            end_date = date.today()
            start_date = end_date - timedelta(days=364)
            num_days = 365

        tasks = Task.objects.filter(
            user=request.user,
            due_date__gte=start_date,
            due_date__lte=end_date
        ).values('due_date').annotate(
            total=Count('id'),
            completed_count=Count('id', filter=Q(completed=True))
        )

        data = {}
        for item in tasks:
            d = item['due_date'].isoformat()
            data[d] = {
                'date': d,
                'total': item['total'],
                'completed': item['completed_count'],
            }

        # Fill in missing dates with zeros
        result = []
        for i in range(num_days):
            d = (start_date + timedelta(days=i)).isoformat()
            result.append(data.get(d, {'date': d, 'total': 0, 'completed': 0}))

        # Calculate streaks
        current_streak = 0
        longest_streak = 0
        temp_streak = 0

        for item in reversed(result):
            if item['completed'] > 0:
                if current_streak == 0:
                    current_streak += 1
                    temp_streak = 1
                else:
                    temp_streak += 1
                    current_streak = temp_streak
                longest_streak = max(longest_streak, temp_streak)
            else:
                if current_streak > 0:
                    break
                temp_streak = 0

        # recalc longest over full period
        longest_streak = 0
        temp_streak = 0
        for item in result:
            if item['completed'] > 0:
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 0

        return Response({
            'streak_data': result,
            'current_streak': current_streak,
            'longest_streak': longest_streak,
        })


class TaskStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        total = Task.objects.filter(user=user).count()
        completed = Task.objects.filter(user=user, completed=True).count()
        today = date.today()
        due_today = Task.objects.filter(user=user, due_date=today).count()
        completed_today = Task.objects.filter(user=user, due_date=today, completed=True).count()

        return Response({
            'total_tasks': total,
            'completed_tasks': completed,
            'pending_tasks': total - completed,
            'completion_percentage': round((completed / total * 100) if total else 0, 1),
            'due_today': due_today,
            'completed_today': completed_today,
        })


class ReorderTasksView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TaskReorderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        task_ids = serializer.validated_data['task_ids']
        tasks = Task.objects.filter(user=request.user, id__in=task_ids)
        task_map = {t.id: t for t in tasks}

        for i, tid in enumerate(task_ids):
            if tid in task_map:
                task_map[tid].order = i
                task_map[tid].save(update_fields=['order'])

        return Response({'message': 'Tasks reordered successfully.'})

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        users = User.objects.annotate(
            completed_tasks=Count('tasks', filter=Q(tasks__completed=True))
        ).order_by('-completed_tasks')[:50]
        
        data = []
        for i, u in enumerate(users):
            data.append({
                'rank': i + 1,
                'username': u.username,
                'avatar_base64': u.avatar_base64,
                'completed_tasks': u.completed_tasks,
                'bio': u.bio,
            })
        return Response(data)

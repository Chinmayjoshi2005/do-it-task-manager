from django.urls import path
from .views import (
    TaskListCreateView, TaskDetailView, CompletedTasksView,
    ToggleTaskView, StreakDataView, TaskStatsView, ReorderTasksView
)

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task_list'),
    path('tasks/completed/', CompletedTasksView.as_view(), name='completed_tasks'),
    path('tasks/reorder/', ReorderTasksView.as_view(), name='task_reorder'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
    path('tasks/<int:pk>/toggle/', ToggleTaskView.as_view(), name='task_toggle'),
    path('streak-data/', StreakDataView.as_view(), name='streak_data'),
    path('task-stats/', TaskStatsView.as_view(), name='task_stats'),
    path('leaderboard/', __import__('apps.tasks.views').tasks.views.LeaderboardView.as_view(), name='leaderboard'),
]

from rest_framework import serializers
from .models import Task
from django.utils import timezone


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'status',
            'completed', 'due_date', 'order', 'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at']

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()

    def update(self, instance, validated_data):
        was_completed = instance.completed
        instance = super().update(instance, validated_data)
        if instance.completed and not was_completed:
            instance.completed_at = timezone.now()
            instance.status = 'completed'
            instance.save(update_fields=['completed_at', 'status'])
        elif not instance.completed and was_completed:
            instance.completed_at = None
            if instance.status == 'completed':
                instance.status = 'pending'
            instance.save(update_fields=['completed_at', 'status'])
        return instance


class TaskReorderSerializer(serializers.Serializer):
    task_ids = serializers.ListField(child=serializers.UUIDField())

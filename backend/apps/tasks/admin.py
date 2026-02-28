from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'status', 'completed', 'due_date', 'created_at']
    list_filter = ['status', 'category', 'completed']
    search_fields = ['title', 'user__username']

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'date_joined', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Security', {'fields': ('security_question', 'security_answer_hash')}),
    )

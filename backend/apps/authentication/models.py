from django.contrib.auth.models import AbstractUser
from django.db import models
import hashlib
import uuid


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    security_question = models.CharField(max_length=255)
    security_answer_hash = models.CharField(max_length=64, default='')
    
    # Profile Extensions
    bio = models.TextField(default='hey i am using do it', blank=True)
    location = models.CharField(max_length=150, default='Earth', blank=True)
    skills = models.CharField(max_length=300, default='React,Django,Python,UI/UX,Algorithms', blank=True)
    avatar_base64 = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = ['email', 'security_question', 'security_answer_hash']

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),
        ]

    def set_security_answer(self, answer):
        self.security_answer_hash = hashlib.sha256(answer.lower().strip().encode()).hexdigest()

    def check_security_answer(self, answer):
        return self.security_answer_hash == hashlib.sha256(answer.lower().strip().encode()).hexdigest()

    def __str__(self):
        return self.username

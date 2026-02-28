from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError('Username is required')
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """Custom user model with security question for password reset."""
    
    SECURITY_QUESTIONS = [
        ('pet', "What was the name of your first pet?"),
        ('school', "What elementary school did you attend?"),
        ('city', "In what city were you born?"),
        ('mother', "What is your mother's maiden name?"),
        ('car', "What was the make of your first car?"),
        ('teacher', "Who was your favorite teacher?"),
        ('book', "What is the title of your favorite childhood book?"),
    ]

    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    security_question = models.CharField(max_length=50, choices=SECURITY_QUESTIONS, default='pet')
    security_answer = models.CharField(max_length=255)  # stored hashed
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),
        ]

    def __str__(self):
        return self.username

    def set_security_answer(self, answer):
        """Hash the security answer before storing."""
        import hashlib
        self.security_answer = hashlib.sha256(answer.lower().strip().encode()).hexdigest()

    def check_security_answer(self, answer):
        """Check if the provided answer matches the stored hash."""
        import hashlib
        hashed = hashlib.sha256(answer.lower().strip().encode()).hexdigest()
        return self.security_answer == hashed

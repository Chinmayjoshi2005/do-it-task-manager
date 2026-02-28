from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)
    security_answer = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'security_question', 'security_answer']

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        if not attrs.get('security_question'):
            raise serializers.ValidationError({"security_question": "Security question is required."})
        if not attrs.get('security_answer'):
            raise serializers.ValidationError({"security_answer": "Security answer is required."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        security_answer = validated_data.pop('security_answer')
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            security_question=validated_data['security_question'],
        )
        user.set_password(validated_data['password'])
        user.set_security_answer(security_answer)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'security_question', 'date_joined', 'last_login', 'bio', 'location', 'skills', 'avatar_base64']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    security_answer = serializers.CharField(required=True)


class ResetPasswordSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    security_answer = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

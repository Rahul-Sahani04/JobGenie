from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import (
    UserProfile, Education, Experience,
    Resume, UserPreferences, JobApplication
)

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'id', 'phone', 'location', 'headline', 'bio', 'skills',
            'experience_years', 'profile_views', 'created_at', 'updated_at'
        ]

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'school', 'degree', 'field', 'start_date', 'end_date',
            'gpa', 'description', 'created_at', 'updated_at'
        ]

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id', 'company', 'position', 'location', 'start_date',
            'end_date', 'current', 'description', 'created_at', 'updated_at'
        ]

class ResumeSerializer(serializers.ModelSerializer):
    education = EducationSerializer(many=True, read_only=True, source='user.education')
    experience = ExperienceSerializer(many=True, read_only=True, source='user.experience')

    class Meta:
        model = Resume
        fields = [
            'id', 'pdf_url', 'latex_source', 'education', 'experience',
            'created_at', 'updated_at'
        ]

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = [
            'id', 'job_types', 'locations', 'experience_levels',
            'remote', 'min_salary', 'max_salary', 'currency',
            'created_at', 'updated_at'
        ]

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job_title', 'company_name', 'job_location',
            'original_job_url', 'job_description', 'status',
            'applied_date', 'notes', 'updated_at'
        ]

class UserProfileCompletionSerializer(serializers.Serializer):
    percentage = serializers.IntegerField()
    missing_fields = serializers.ListField(child=serializers.CharField())

class UserPreferencesUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = [
            'job_types', 'locations', 'experience_levels',
            'remote', 'min_salary', 'max_salary', 'currency'
        ]

    def validate(self, data):
        if 'min_salary' in data and 'max_salary' in data:
            if data['min_salary'] > data['max_salary']:
                raise serializers.ValidationError(
                    "Minimum salary cannot be greater than maximum salary"
                )
        return data
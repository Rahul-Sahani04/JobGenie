from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.contrib.auth.models import User
from .models import (
    UserProfile, Education, Experience, Resume,
    UserPreferences, JobApplication
)
from .serializers import (
    UserProfileSerializer, EducationSerializer,
    ExperienceSerializer, ResumeSerializer,
    UserPreferencesSerializer, JobApplicationSerializer,
    UserProfileCompletionSerializer, UserPreferencesUpdateSerializer,
    ExtendedUserSerializer
)

class UserProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def completion(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        missing_fields = []
        completion_rules = {
            'basic_info': ['phone', 'location', 'headline'],
            'bio': ['bio'],
            'skills': ['skills'],
            'experience': lambda p: p.user.experience.exists(),
            'education': lambda p: p.user.education.exists(),
            'resume': lambda p: hasattr(p.user, 'resume')
        }

        total_fields = len(completion_rules)
        completed_fields = 0

        for field, rule in completion_rules.items():
            if callable(rule):
                if rule(profile):
                    completed_fields += 1
                else:
                    missing_fields.append(field)
            else:
                if any(bool(getattr(profile, f)) for f in rule):
                    completed_fields += 1
                else:
                    missing_fields.append(field)

        percentage = int((completed_fields / total_fields) * 100)

        serializer = UserProfileCompletionSerializer({
            'percentage': percentage,
            'missing_fields': missing_fields
        })
        return Response(serializer.data)

class EducationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EducationSerializer

    def get_queryset(self):
        return Education.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExperienceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExperienceSerializer

    def get_queryset(self):
        return Experience.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ResumeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ResumeSerializer

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def generate_latex(self, request, pk=None):
        resume = self.get_object()
        # Here you would implement LaTeX generation logic
        # For now, we'll return a placeholder
        resume.latex_source = "% LaTeX resume template\n\\documentclass{article}"
        resume.save()
        return Response({
            'latex_source': resume.latex_source,
            'pdf_url': resume.pdf_url
        })

class UserPreferencesViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserPreferencesSerializer

    def get_queryset(self):
        return UserPreferences.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['put'])
    def update_preferences(self, request):
        preferences, _ = UserPreferences.objects.get_or_create(user=request.user)
        serializer = UserPreferencesUpdateSerializer(preferences, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = JobApplicationSerializer

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['put'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        status = request.data.get('status')
        if status not in dict(JobApplication.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        application.status = status
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExtendedUserSerializer

    def get_queryset(self):
        return User.objects.annotate(
            applications_count=Count('applications')
        ).filter(id=self.request.user.id)

    def get_object(self):
        return get_object_or_404(self.get_queryset())
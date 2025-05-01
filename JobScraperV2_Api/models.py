from django.db import models
from django.contrib.auth.models import User
import json

class JSONField(models.TextField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, expression, connection):
        if value is None:
            return []
        return json.loads(value)

    def to_python(self, value):
        if isinstance(value, list):
            return value
        if value is None:
            return []
        return json.loads(value)

    def get_prep_value(self, value):
        if value is None:
            return '[]'
        return json.dumps(value)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=100, blank=True)
    headline = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    skills = JSONField(default=list, blank=True)
    experience_years = models.IntegerField(default=0)
    profile_views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Education(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='education')
    school = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    gpa = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Experience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experience')
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    current = models.BooleanField(default=False)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Resume(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='resume')
    pdf_url = models.URLField(blank=True)
    latex_source = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UserPreferences(models.Model):
    JOB_TYPES = [
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Contract', 'Contract'),
        ('Internship', 'Internship'),
        ('Freelance', 'Freelance'),
    ]

    EXPERIENCE_LEVELS = [
        ('Entry level', 'Entry level'),
        ('Mid level', 'Mid level'),
        ('Senior level', 'Senior level'),
        ('Executive', 'Executive'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    job_types = JSONField(default=list)
    locations = JSONField(default=list)
    experience_levels = JSONField(default=list)
    remote = models.BooleanField(default=False)
    min_salary = models.IntegerField(null=True, blank=True)
    max_salary = models.IntegerField(null=True, blank=True)
    currency = models.CharField(max_length=3, default='INR')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        valid_job_types = [job_type[0] for job_type in self.JOB_TYPES]
        valid_exp_levels = [level[0] for level in self.EXPERIENCE_LEVELS]
        
        self.job_types = [jt for jt in self.job_types if jt in valid_job_types]
        self.experience_levels = [el for el in self.experience_levels if el in valid_exp_levels]

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('Applied', 'Applied'),
        ('In Review', 'In Review'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job_title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    job_location = models.CharField(max_length=200)
    original_job_url = models.URLField()
    job_description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Applied')
    applied_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_date']
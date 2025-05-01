from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import (
    UserProfile, Education, Experience,
    Resume, UserPreferences, JobApplication
)

class UserProfileTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_profile_completion(self):
        response = self.client.get('/api/profile/completion/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('percentage', response.data)
        self.assertIn('missingFields', response.data)

class ResumeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.resume = Resume.objects.create(user=self.user)
        
    def test_add_education(self):
        data = {
            'school': 'Test University',
            'degree': 'BSc',
            'field': 'Computer Science',
            'start_date': '2020-01-01',
            'end_date': '2024-01-01'
        }
        response = self.client.post('/api/education/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Education.objects.count(), 1)
        
    def test_add_experience(self):
        data = {
            'company': 'Test Company',
            'position': 'Software Engineer',
            'location': 'Test City',
            'start_date': '2020-01-01',
            'description': 'Test description'
        }
        response = self.client.post('/api/experience/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Experience.objects.count(), 1)

    def test_generate_latex(self):
        response = self.client.post(f'/api/resumes/{self.resume.id}/latex/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('latex_source', response.data)
        self.assertIn('pdf_url', response.data)

class PreferencesTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.preferences = UserPreferences.objects.create(user=self.user)

    def test_update_preferences(self):
        data = {
            'job_types': ['Full-time', 'Part-time'],
            'locations': ['New York', 'Remote'],
            'experience_levels': ['Entry level'],
            'remote': True,
            'min_salary': 50000,
            'max_salary': 100000,
            'currency': 'USD'
        }
        response = self.client.put('/api/preferences/update/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['job_types'], data['job_types'])
        self.assertEqual(response.data['remote'], data['remote'])

    def test_invalid_salary_range(self):
        data = {
            'min_salary': 100000,
            'max_salary': 50000
        }
        response = self.client.put('/api/preferences/update/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class ApplicationTrackingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_track_application(self):
        data = {
            'original_job_url': 'https://example.com/job/123',
            'status': 'Applied'
        }
        response = self.client.post('/api/applications/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobApplication.objects.count(), 1)

    def test_update_application_status(self):
        application = JobApplication.objects.create(
            user=self.user,
            original_job_url='https://example.com/job/123'
        )
        data = {'status': 'In Review'}
        response = self.client.put(
            f'/api/applications/{application.id}/status/',
            data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'In Review')

    def test_list_applications(self):
        JobApplication.objects.create(
            user=self.user,
            original_job_url='https://example.com/job/123'
        )
        JobApplication.objects.create(
            user=self.user,
            original_job_url='https://example.com/job/456'
        )
        response = self.client.get('/api/applications/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
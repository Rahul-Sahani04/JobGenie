from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    UserProfileViewSet,
    EducationViewSet,
    ExperienceViewSet,
    ResumeViewSet,
    UserPreferencesViewSet,
    JobApplicationViewSet,
    UserViewSet
)
from .auth_views import register, login

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'experience', ExperienceViewSet, basename='experience')
router.register(r'resumes', ResumeViewSet, basename='resume')
router.register(r'preferences', UserPreferencesViewSet, basename='preferences')
router.register(r'applications', JobApplicationViewSet, basename='applications')

app_name = 'api'

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API endpoints
    path('', include(router.urls)),
    
    # Custom endpoints
    path('profile/completion/', 
         UserProfileViewSet.as_view({'get': 'completion'}),
         name='profile-completion'),
         
    path('preferences/update/',
         UserPreferencesViewSet.as_view({'put': 'update_preferences'}),
         name='update-preferences'),
         
    path('applications/<int:pk>/status/',
         JobApplicationViewSet.as_view({'put': 'update_status'}),
         name='update-application-status'),
         
    path('resumes/<int:pk>/latex/',
         ResumeViewSet.as_view({'post': 'generate_latex'}),
         name='generate-latex-resume'),
]

# API Endpoints Documentation:
# Auth:
# - POST /auth/register/ - Register new user
# - POST /auth/login/ - Login user
# - POST /auth/token/ - Get JWT token
# - POST /auth/token/refresh/ - Refresh JWT token
#
# API:
# - /users/ - User management
# - /profiles/ - User profile management
# - /education/ - Education entries management
# - /experience/ - Experience entries management
# - /resumes/ - Resume management
# - /preferences/ - Job preferences management
# - /applications/ - Job applications management
# - /profile/completion/ - Get profile completion status
# - /preferences/update/ - Update job preferences
# - /applications/{id}/status/ - Update application status
# - /resumes/{id}/latex/ - Generate LaTeX resume
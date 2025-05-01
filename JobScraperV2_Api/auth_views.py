from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from django.db import transaction
from .models import UserProfile, UserPreferences

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        with transaction.atomic():
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                
                # Create default profile and preferences
                UserProfile.objects.create(user=user)
                UserPreferences.objects.create(user=user)
                
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'user': serializer.data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': 'Could not register user',
            'details': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        user = User.objects.get(username=request.data['email'])
        if not user.check_password(request.data['password']):
            raise User.DoesNotExist
            
        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(user)
        
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    except User.DoesNotExist:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
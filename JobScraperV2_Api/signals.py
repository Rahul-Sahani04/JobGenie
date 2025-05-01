from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile, UserPreferences

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create UserProfile and UserPreferences when a new User is created."""
    if created:
        UserProfile.objects.create(
            user=instance,
            skills=[],
            experience_years=0,
        )
        UserPreferences.objects.create(
            user=instance,
            job_types=[],
            locations=[],
            experience_levels=[],
            remote=False,
            currency='INR'
        )

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Ensure profile and preferences are saved when User is saved."""
    if hasattr(instance, 'profile'):
        instance.profile.save()
    if hasattr(instance, 'preferences'):
        instance.preferences.save()
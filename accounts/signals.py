from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import UserProfile

# It says: "Listen for the post_save signal, specifically from the User model"
@receiver(post_save, sender=User)
def create_profile_on_user_creation(sender, instance, created, **kwargs):
    """
    This function is triggered when a User object is saved.
    'instance' is the User object that was saved.
    'created' is a boolean flag. If True, the user was just created.
    """
    
    # We only want to create a profile when the User is *first created*.
    if created:
        UserProfile.objects.create(user=instance)
"""_summary_
"""
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ProfileType


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Create or update the user profile associated with the user.
    """
    try:
        profile = instance.profiletype
    except ProfileType.DoesNotExist:
        profile = ProfileType(user=instance)

    profile.save()

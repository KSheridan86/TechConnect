"""
This file is used to create a developer profile when a new user is created.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import DeveloperProfile


@receiver(post_save, sender=User)
def create_developer_profile(sender, instance, created, **_):
    """
    Create a developer profile when a new user is created.
    """
    if created:
        # pylint: disable=E1101
        DeveloperProfile.objects.create(user=instance)

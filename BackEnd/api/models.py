"""
Django Models for the TechConnect Developer Platform

This module defines the Django models used in a developer platform.

Author: [Ken Sheridan]
Date: [19/10/2023]
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator
# from django.db.models.signals import post_save
# from django.dispatch import receiver
from django.utils import timezone


class Skill(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name}"


# Developer Profile Model
class DeveloperProfile(models.Model):
    """
    This model defines the developer profile,
    including information about a developer's skills,
    experience, and other details.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=50, null=True, blank=True)
    firstname = models.CharField(max_length=50, null=True, blank=True)
    lastname = models.CharField(max_length=50, null=True, blank=True)
    email = models.CharField(max_length=100, null=True, blank=True)
    github = models.URLField(null=True, blank=True)
    linkedin = models.URLField(null=True, blank=True)
    portfolio_url = models.URLField(null=True, blank=True)
    intro_text = models.TextField(null=True, blank=True)
    biography_text = models.TextField(null=True, blank=True)
    avatar = models.ImageField(upload_to='images/', null=True, blank=True)
    years_of_experience = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    available = models.BooleanField(default=False, null=True, blank=True)
    date_available = models.DateField(default=timezone.now,
                                      null=True, blank=True)
    skills_1 = models.ManyToManyField(
        Skill, related_name='skills_1', blank=True)
    skills_2 = models.ManyToManyField(
        Skill, related_name='skills_2', blank=True)

    def __str__(self):
        return f"{self.user}"


# Project Model
class Project(models.Model):
    """
    This model represents a project and includes information
    such as project name, description, and the associated developer.
    """
    name = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    site_url = models.URLField(null=True, blank=True)
    repo_url = models.URLField(null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    tech_stack = models.TextField(null=True, blank=True)
    developer = models.ForeignKey(
        DeveloperProfile, on_delete=models.CASCADE,
        null=True, blank=True, related_name='projects')

    def __str__(self):
        return f"{self.name}"


# Developer Review Model
class DeveloperReview(models.Model):
    """
    This model represents a review given by a user to a developer
    and includes details like the review content, date, recommendation,
    and rating.
    """
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    reviewee = models.ForeignKey(
        DeveloperProfile, on_delete=models.CASCADE,
        related_name='reviews_received')
    review = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    recommended = models.BooleanField()
    rating = models.IntegerField(
        null=True, blank=True, validators=[MaxValueValidator(5)])

    def __str__(self):
        return f"{self.reviewee}"


# Project Review Model
class ProjectReview(models.Model):
    """
    This model represents a review given by a user to a project and includes
    details like the review content, date, and rating.
    """
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    reviewee = models.ForeignKey(DeveloperProfile, on_delete=models.CASCADE)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='reviews')
    review = models.TextField()
    rating = models.DecimalField(max_digits=2, decimal_places=1,
                                 null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project}"


class PrivateMessage(models.Model):
    """
    This model represents a private message that can be sent between
    any 2 users of the site.
    """
    sender = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='sent_messages')
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='received_messages')
    date = models.DateTimeField(auto_now_add=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} to {self.recipient} ({self.date})"

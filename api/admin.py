"""
This file is used to register the models in the admin panel.
"""
from django.contrib import admin
from .models import (DeveloperProfile, Project, Skill,
                     DeveloperReview, PrivateMessage)
# Register your models here.


@admin.register(DeveloperProfile)
class DeveloperProfileAdmin(admin.ModelAdmin):
    """_summary_

    Args:
        admin (_type_): _description_
    """
    list_display = ('user', 'username', 'location', 'available')
    list_filter = ('user', 'username', 'location', 'available')
    search_fields = ('user', 'username', 'location', 'available')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    """_summary_

    Args:
        admin (_type_): _description_
    """
    list_display = ('name',)
    list_filter = ('name',)
    search_fields = ('name',) 


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """_summary_

    Args:
        admin (_type_): _description_
    """
    list_display = ('name', 'developer', 'site_url')
    list_filter = ('name', 'developer', 'site_url')
    search_fields = ('name', 'developer', 'site_url')


@admin.register(DeveloperReview)
class DeveloperReviewAdmin(admin.ModelAdmin):
    """_summary_

    Args:
        admin (_type_): _description_
    """
    list_display = ('date', 'reviewer', 'reviewee')
    list_filter = ('date', 'reviewer', 'reviewee')
    search_fields = ('date', 'reviewer', 'reviewee')


@admin.register(PrivateMessage)
class PrivateMessageAdmin(admin.ModelAdmin):
    """_summary_

    Args:
        admin (_type_): _description_
    """
    list_display = ('recipient', 'sender', 'date')
    list_filter = ('recipient', 'sender', 'date')
    search_fields = ('recipient', 'sender', 'date')

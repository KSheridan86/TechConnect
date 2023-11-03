"""
_summary_
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (ProfileType, DeveloperProfile, Skill, Project,
                     DeveloperReview, ProjectReview, PrivateMessage)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializes the User model.
    """
    # profile_type = serializers.SerializerMethodField()

    class Meta:
        """
        _summary_
        """
        model = User
        fields = ['id', 'username', 'email',  # 'profile_type'
                  ]

    def get_profile_type(self, obj):
        """_summary_
        This method returns the profile type of the user.
        """
        try:
            profile = obj.profiletype
            return profile.type
        # pylint: disable=E1101
        except ProfileType.DoesNotExist:
            return None


class DeveloperProfileSerializer(serializers.ModelSerializer):
    """
    Serializes the DeveloperProfile model.
    """
    class Meta:
        """
        _summary_
        """
        model = DeveloperProfile
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    """
    Serializes the Skill model.
    """
    class Meta:
        """
        _summary_
        """
        model = Skill
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializes the Project model.
    """
    class Meta:
        """
        _summary_
        """
        model = Project
        fields = '__all__'


class DeveloperReviewSerializer(serializers.ModelSerializer):
    """
    Serializes the DeveloperReview model.
    """
    class Meta:
        """
        _summary_
        """
        model = DeveloperReview
        fields = '__all__'


class ProjectReviewSerializer(serializers.ModelSerializer):
    """
    Serializes the ProjectReview model.
    """
    class Meta:
        """
        _summary_
        """
        model = ProjectReview
        fields = '__all__'


class PrivateMessageSerializer(serializers.ModelSerializer):
    """
    Serializes the PrivateMessage model.
    """
    class Meta:
        """
        _summary_
        """
        model = PrivateMessage
        fields = '__all__'

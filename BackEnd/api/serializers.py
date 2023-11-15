"""
_summary_
"""

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import (DeveloperProfile, Project,
                     DeveloperReview, ProjectReview, PrivateMessage)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializes the User model.
    """
    account_type = serializers.SerializerMethodField(read_only=True)

    class Meta:
        """
        _summary_
        """
        model = User
        fields = ['id', 'username', 'email', 'account_type']

    def get_account_type(self, obj):
        """
        Function to get the account type from the user model
        """
        account_type = obj.first_name
        if account_type == '':
            account_type = 'Client'
        return account_type


class UserSerializerWithToken(UserSerializer):
    """
    Serializes the User model with a token.
    """
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        """
        _summary_
        """
        model = User
        fields = ['id', 'username', 'email', 'account_type', 'token']

    def get_token(self, obj):
        """
        Function to get the token from the user model
        """
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class DeveloperProfileSerializer(serializers.ModelSerializer):
    """
    Serializes the DeveloperProfile model.
    """
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        # pylint: disable=E1101
        validators=[UniqueValidator(queryset=DeveloperProfile.objects.all())]
    )

    class Meta:
        """
        _summary_
        """
        model = DeveloperProfile
        fields = '__all__'
        extra_kwargs = {
            'avatar': {'required': False, 'allow_null': True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Convert comma-separated skills to lists
        data['skills_level_1'] = self.split_skills(data['skills_level_1'])
        data['skills_level_2'] = self.split_skills(data['skills_level_2'])

        return data

    def split_skills(self, skills):
        """
        Function to split skills into a list
        """
        # Check if skills is a string before splitting
        if isinstance(skills, str):
            return [s.strip() for s in skills.split(',') if s.strip()]
        return skills


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

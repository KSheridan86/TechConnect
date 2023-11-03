"""
The views to control the API.
"""

# from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .users import users
# pylint: disable=W0611
from .models import (User, ProfileType, DeveloperProfile, Skill, Project,
                     DeveloperReview, ProjectReview, PrivateMessage)
from .serializers import (UserSerializer, DeveloperProfileSerializer,
                          SkillSerializer, ProjectSerializer,
                          DeveloperReviewSerializer, ProjectReviewSerializer,
                          PrivateMessageSerializer)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer for the token.
    """
    def validate(self, attrs):
        """
        Validate the token.
        """
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['email'] = self.user.email
        # data['profile_type'] = self.user.profile_type

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    """
    View for the token.
    """
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def get_routes(request):
    """
    Setting up the routes for the API.
    """
    routes = [
        'api/urls.py',
        'api/views.py',
        'api/serializers.py',
        'api/models.py',
        'api/admin.py',
        'api/tests.py',
    ]
    return Response(routes)


@api_view(['GET'])
def get_users(request):
    """
    Return all users.
    """
    all_users = User.objects.all()
    serializer = UserSerializer(all_users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def user_profile(request):
    """
    Return single user.
    """
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

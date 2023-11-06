"""
The views to control the API.
"""

# from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
# from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
# pylint: disable=W0611
from .models import (User, ProfileType, DeveloperProfile, Skill, Project,
                     DeveloperReview, ProjectReview, PrivateMessage)
from .serializers import (UserSerializer, UserSerializerWithToken, DeveloperProfileSerializer,
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
        serializer = UserSerializerWithToken(self.user).data
        # data['username'] = self.user.username
        # data['email'] = self.user.email
        # data['account_type'] = self.user.first_name
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    """
    View for the token.
    """
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_users(request):
    """
    Return all users.
    """
    all_users = User.objects.all()
    serializer = UserSerializer(all_users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def register_user(request):
    """
    Register a new user.
    """
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['account_type'],
            username=data['username'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except IntegrityError:
        return Response( 
            "Whoops! Username or email is already registered to an account.")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Return single user.
    """
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

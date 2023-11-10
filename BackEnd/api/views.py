"""
The views to control the API.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError

# pylint: disable=W0611
from .models import (User, DeveloperProfile, Skill, Project,
                     DeveloperReview, ProjectReview, PrivateMessage)
from .serializers import (UserSerializer, UserSerializerWithToken,
                          DeveloperProfileSerializer, SkillSerializer,
                          ProjectSerializer, DeveloperReviewSerializer,
                          ProjectReviewSerializer, PrivateMessageSerializer)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer for the token.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['account_type'] = user.first_name

        return token

    def validate(self, attrs):
        """
        Validate the token.
        """
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class MyTokenObtainPairView(TokenObtainPairView):
    """
    View for the token.
    """
    serializer_class = MyTokenObtainPairSerializer


# pylint: disable=W0613
@api_view(['GET'])
# @permission_classes([IsAdminUser])
def get_users(request):
    """
    Return all users.
    """
    all_users = User.objects.all()
    developers = all_users.filter(first_name__iexact='Developer')
    serializer = UserSerializer(developers, many=True)
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
            "Whoops! That Username is unavailable.")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Return developer profile.
    """
    user = request.user
    # pylint: disable=E1101
    profile = DeveloperProfile.objects.get(user=user)
    serializer = DeveloperProfileSerializer(profile, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update developer profile.
    """
    user = request.user
    # pylint: disable=E1101
    profile = DeveloperProfile.objects.get(user=user)

    serializer = DeveloperProfileSerializer(
                 profile, data=request.data.get('profile', {}), partial=True)

    print(serializer.initial_data)
    if serializer.is_valid():
        print("Serializer is valid")
        serializer.save()
        updated_data = DeveloperProfileSerializer(serializer.instance).data
        print("Data after update:", updated_data)
        return Response(updated_data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

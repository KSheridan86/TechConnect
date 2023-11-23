"""
The views to control the API.
"""

from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# pylint: disable=W0611
from .models import (User, DeveloperProfile, Project)
# from .models import (DeveloperReview, ProjectReview, PrivateMessage)
from .serializers import (UserSerializer, UserSerializerWithToken,
                          DeveloperProfileSerializer, ProjectSerializer,)
# from .serializers import ( DeveloperReviewSerializer,
#                           ProjectReviewSerializer, PrivateMessageSerializer)


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


@api_view(['POST'])
def logout(request):
    """
    View to logout a user.
    """
    # pylint: disable=W0718
    try:
        # Optionally, you can perform additional logout logic here
        request.session.flush()  # Clear the session data
        return Response({'success': 'Logout successful'})
    except Exception as e:
        print(str(e))
        return Response({'error': 'Logout failed'}, status=400)


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
@permission_classes([AllowAny])
def user_profile(request, user_id=None):
    """
    Return developer profile.
    """
    # pylint: disable=E1101
    if user_id:
        user = get_object_or_404(User, id=user_id)
        print("ID:", user_id)
    else:
        user = request.user
    profile = DeveloperProfile.objects.get(user=user)
    projects = Project.objects.filter(developer=profile)
    print("Projects:", projects)

    serializer = DeveloperProfileSerializer(
        profile, context={'projects': projects})
    return Response(serializer.data)


@api_view(['PUT', 'POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update developer profile.
    """
    user = request.user
    # pylint: disable=E1101
    profile = DeveloperProfile.objects.get(user=user)

    if request.data.get('delete_skills'):
        # Clear the skills fields
        profile.skills_level_1 = "",
        profile.skills_level_2 = "",

        # Save the profile to persist the changes
        profile.save()

        return Response({'message': 'Skills deleted successfully'})

    serializer = DeveloperProfileSerializer(
        profile, data=request.data, partial=True)

    print("Request Data:", request.data)  # Add this line

    print(serializer.initial_data)
    if serializer.is_valid():
        print("Serializer is valid")
        serializer.save()
        updated_data = DeveloperProfileSerializer(serializer.instance).data
        print("Data after update:", updated_data)
        return Response(updated_data)
    else:
        print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'PUT',])
@permission_classes([IsAuthenticated])
def add_project(request):
    """
    View to add a project.
    """

    # Fetch the DeveloperProfile associated with the current user
    developer_profile = get_object_or_404(DeveloperProfile, user=request.user)
    # Make a copy of the request data
    mutable_data = request.data.copy()
    # Modify the 'developer' field in the copy
    mutable_data['developer'] = developer_profile.id
    # Continue with project creation
    serializer = ProjectSerializer(data=mutable_data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""
The views to control the API.
"""

from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.db import IntegrityError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# pylint: disable=W0611
from .models import (User, DeveloperProfile, Project, Skill)
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


@api_view(['POST'])
def logout(request):
    """
    View to logout a user.
    """
    # pylint: disable=W0718
    try:
        request.session.flush()  # Clear the session data
        return Response({'success': 'Logout successful'})
    except Exception as e:
        print(str(e))
        return Response({'error': 'Logout failed'}, status=400)


# pylint: disable=W0613
@api_view(['GET'])
def get_users(request):
    """
    Return all users.
    """
    # pylint: disable=E1101
    all_users = User.objects.all()
    developers = all_users.filter(first_name__iexact='Developer')
    developer_profiles = DeveloperProfile.objects.filter(user__in=developers)
    serializer = DeveloperProfileSerializer(developer_profiles, many=True)
    return Response(serializer.data)


# pylint: disable=W0613
@api_view(['GET'])
def get_all_users(request):
    """
    Return all users.
    """
    all_users = User.objects.all()
    serializer = UserSerializer(all_users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def user_profile(request, user_id=None):
    """
    Return developer profile.
    """
    # pylint: disable=E1101
    if user_id:
        user = get_object_or_404(User, id=user_id)
    else:
        user = request.user
    profile = DeveloperProfile.objects.get(user=user)
    projects = Project.objects.filter(developer=profile)

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
        # profile.skills_level_1 = "",
        # profile.skills_level_2 = "",
        profile.skills_1.clear()
        profile.skills_2.clear()

        # Save the profile to persist the changes
        profile.save()

        return Response({'message': 'Skills deleted successfully'})
    print(request.data)

    print(profile.skills_1.all())
    # Extract primary_skills and secondary_skills from request data
    primary_skills = request.data.getlist('skills_1[]', [])
    secondary_skills = request.data.getlist('skills_2[]', [])
    print('primary_skills:', primary_skills)
    print('secondary_skills:', secondary_skills)

    # Clear existing skills
    # profile.skills_1.clear()
    # profile.skills_2.clear()

    # Add new skills
    
    # Create and add new skills
    for skill_name in primary_skills:
        skill, created = Skill.objects.get_or_create(name=skill_name.strip())
        profile.skills_1.add(skill)

    for skill_name in secondary_skills:
        skill, created = Skill.objects.get_or_create(name=skill_name.strip())
        profile.skills_2.add(skill)
    profile.save()

    serializer = DeveloperProfileSerializer(
        profile, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        updated_data = DeveloperProfileSerializer(serializer.instance).data
        return Response(updated_data)
    else:
        print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile(request, profile_id):
    """
    Delete profile.
    """
    profile = get_object_or_404(DeveloperProfile, id=profile_id)

    # Check if the user making the request is the owner of the profile
    if profile.user != request.user:
        return Response({'detail':
                        'You do not have permission to delete this profile.'
                         }, status=403)

    profile.delete()
    return Response({'detail': 'Profile deleted successfully.'})


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


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_project(request, project_id):
    """
    View to add a project.
    """
    project = get_object_or_404(Project, id=project_id)

    # Check if the user making the request is the owner of the project
    if project.developer.user != request.user:
        return Response({'detail':
                         'You do not have permission to delete this project.'
                         }, status=403)

    project.delete()
    return Response({'detail': 'Project deleted successfully.'})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request, user_id):
    """
    View to delete a user.
    """
    # pylint: disable=W0718
    # Check if the user making the request is the one being deleted
    if request.user.id != user_id:
        return Response({"error": "Unauthorized"}, status=401)

    # Get the user object or return a 404 if not found
    user = get_object_or_404(User, id=user_id)

    try:
        user.delete()
        return Response({"message": "User account deleted successfully"})

    except Exception as e:
        # Log the error or handle it accordingly
        return Response({"error": str(e)}, status=500)


def view_skills(request, skill_id):
    """
    Retrieve skills.
    """
    try:
        # pylint: disable=E1101
        skill = Skill.objects.get(pk=skill_id)
        skill_details = {'id': skill.id, 'name': skill.name}
        return JsonResponse(skill_details)
    except Skill.DoesNotExist:
        return JsonResponse({'error': 'Skill not found'}, status=404)

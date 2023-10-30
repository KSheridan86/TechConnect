"""
The views to control the API.
"""


# from django.shortcuts import render
# pylint: disable=E0401
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .users import users


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
    return Response(users)


@api_view(['GET'])
def get_user(request, pk):
    """
    Return all users.
    """
    user = "Me"
    for i in users:
        if i["id"] == int(pk):
            user = i
            break
    return Response(user)

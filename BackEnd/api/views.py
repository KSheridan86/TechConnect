"""
The views to control the API.
"""


# from django.shortcuts import render
from django.http import JsonResponse
from .users import users


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
    return JsonResponse(routes, safe=False)


def get_users(request):
    """
    Return all users.
    """
    return JsonResponse(users, safe=False)

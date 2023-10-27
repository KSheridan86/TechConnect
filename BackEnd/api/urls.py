"""
Urls to access the api
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_routes, name="routes"),
    path('users/', views.get_users, name="users"),
]

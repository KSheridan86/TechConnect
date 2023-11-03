"""
Urls to access the api
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from . import views


urlpatterns = [
    path('users/login/', TokenObtainPairView.as_view(),
         name="token_obtain_pair"),
    path('', views.get_routes, name="routes"),
    path('users/', views.get_users, name="users"),
    path('users/<str:pk>/', views.get_user, name="user"),
]

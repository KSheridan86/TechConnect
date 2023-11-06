"""
Urls to access the api
"""

from django.urls import path
from . import views


urlpatterns = [
    path('users/login/', views.MyTokenObtainPairView.as_view(),
         name="token_obtain_pair"),
    path('users/register/', views.register_user, name="register_user"),
    path('users/profile/', views.user_profile, name="users-profile"),
    path('users/', views.get_users, name="users"),
]

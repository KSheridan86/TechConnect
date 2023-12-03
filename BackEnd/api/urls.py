"""
Urls to access the api
"""

from django.urls import path
from . import views


urlpatterns = [
     path('users/', views.get_users, name="users"),
     path('users/all-users/', views.get_all_users, name="all_users"),
     path('users/login/', views.MyTokenObtainPairView.as_view(),
          name="token_obtain_pair"),
     path('users/logout/', views.logout, name='logout'),
     path('users/delete-account/<int:user_id>/',
          views.delete_account, name="delete_account"),
     path('users/register/', views.register_user, name="register_user"),
     path('users/profile/<int:user_id>/',
          views.user_profile, name="users-profile"),
     path('users/update_profile/', views.update_profile,
          name="update_profile"),
     path('users/delete-profile/<int:profile_id>/',
          views.delete_profile, name="delete_profile"),
     path('users/projects/<int:project_id>/', views.projects, name="projects"),
     path('users/add_project/', views.add_project, name="add_project"),
     path('users/update_project/<int:project_id>/',
          views.update_project, name="update_project"),
     path('users/delete-project/<int:project_id>/',
          views.delete_project, name="delete_project"),
     path('users/skills/<int:skill_id>/',
          views.view_skills, name="view-skills"),
     path('users/submit-review/', views.submit_review, name="submit_review"),
]

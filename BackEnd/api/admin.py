from django.contrib import admin
from .models import (ProfileType, DeveloperProfile, Skill, Project,
                     DeveloperReview, ProjectReview, PrivateMessage)
# Register your models here.

admin.site.register(ProfileType)
admin.site.register(DeveloperProfile)
admin.site.register(Skill)
admin.site.register(Project)
admin.site.register(DeveloperReview)
admin.site.register(ProjectReview)
admin.site.register(PrivateMessage)

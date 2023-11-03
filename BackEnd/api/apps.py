"""
This file is used to configure the api app.
"""
from django.apps import AppConfig


class ApiConfig(AppConfig):
    """
    This class defines the api app configuration.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # pylint: disable=W0611, C0415
        import api.signals

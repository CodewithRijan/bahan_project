from django.apps import AppConfig


class CrowdsourceAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'crowdsource_app'

    def ready(self):
        
        from . import signals
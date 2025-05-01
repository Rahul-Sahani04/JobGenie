from django.apps import AppConfig

class JobscraperConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'JobScraperV2_Api'

    def ready(self):
        """Initialize app configurations and connect signals."""
        # Import signals to ensure they're connected
        from . import signals

        # Register any additional app initialization here
        pass
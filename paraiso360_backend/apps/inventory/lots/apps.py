from django.apps import AppConfig
from django.contrib.gis.db import models as gis_models
class LotsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.inventory.lots'

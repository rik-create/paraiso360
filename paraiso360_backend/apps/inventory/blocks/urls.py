# paraiso360_backend/apps/inventory/blocks/urls.py
from django.urls import path
from .views import BlockGeoJSONView

urlpatterns = [
    path('geojson/', BlockGeoJSONView.as_view(), name='block-geojson'),
]

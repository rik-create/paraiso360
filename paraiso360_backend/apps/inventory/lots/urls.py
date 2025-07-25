# paraiso360_backend/apps/inventory/lots/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import LotViewSet

router = DefaultRouter()
router.register(r'', LotViewSet , basename='lot')

urlpatterns = [
    path('', include(router.urls)),
]
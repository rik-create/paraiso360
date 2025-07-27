# paraiso360_backend/apps/inventory/lots/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import BurialViewSet

router = DefaultRouter()
router.register(r'', BurialViewSet, basename='burial')

urlpatterns = [
    path('', include(router.urls)),
]

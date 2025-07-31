# paraiso360_backend/paraiso360_backend/urls.py
"""
URL configuration for paraiso360_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView
)
from apps.management.users.views import csrf_token_view, test_post, test_get, CustomTokenObtainPairView


# Swagger schema view config
schema_view = get_schema_view(
    openapi.Info(
        title="Paraiso360 REST API v1",
        default_version='v1',
        description="Auto-generated API docs",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Versioned API routes
    path('api/<str:version>/', include([
        path('burials/', include('apps.inventory.burials.urls')),
        path('users/', include('apps.management.users.urls')),
        path('lots/', include('apps.inventory.lots.urls')),
        path('clients/', include('apps.inventory.clients.urls')),
        path('blocks/', include('apps.inventory.blocks.urls')),


        # JWT routes under versioned API
        path('token/', CustomTokenObtainPairView.as_view(),
             name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
        path('token/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),

        path('password_reset/', include('django_rest_passwordreset.urls',
             namespace='password_reset')),


        # CSRF token view
        path('csrf/', csrf_token_view, name='csrf_token'),
        # Test POST endpoint
        path('test-post/', test_post, name='test_post'),
        # Test GET endpoint
        path('test-get/', test_get, name='test_get'),


    ])),

    # Docs
    re_path(r'^docs/$', schema_view.with_ui('swagger',
            cache_timeout=0), name='swagger-docs'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc',
            cache_timeout=0), name='redoc-docs'),
]

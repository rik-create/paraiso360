# paraiso360_backend/apps/management/users/views.py
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework.generics import RetrieveAPIView
from .models import AppUser
from .serializers import AppUserSerializer
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin, IsStaff
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class HelloEveryoneView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, version=None):
        return Response({"message": f"Hello, {request.user.username}. You are authenticated."})


class HelloStaffView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request, version=None):
        return Response({"message": f"Hello Staff or Admin: {request.user.username}"})


class HelloAdminView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, version=None):
        return Response({"message": f"Hello Admin: {request.user.username}"})


class AppUserCreateView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer


class AppUserDetailView(RetrieveAPIView):
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer


class CurrentUserRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppUserSerializer

    def get_object(self):
        # Return the current logged-in user
        return self.request.user


@ensure_csrf_cookie
def csrf_token_view(request, version=None):
    return JsonResponse({'detail': 'CSRF cookie set'})


@csrf_protect
@require_POST
def test_post(request, version=None):
    return JsonResponse({"status": "POST success"})


@csrf_protect
@require_GET
def test_get(request, version=None):
    return JsonResponse({"status": "GET success"})

# paraiso360_backend/apps/management/users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin, IsStaff

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
    

from rest_framework import generics
from .serializers import AppUserSerializer
from .models import AppUser

class AppUserCreateView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer


from rest_framework.generics import RetrieveAPIView
from .models import AppUser
from .serializers import AppUserSerializer

class AppUserDetailView(RetrieveAPIView):
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

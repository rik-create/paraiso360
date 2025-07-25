# paraiso360_backend/apps/inventory/lots/views.py
from rest_framework import viewsets
from .models import Lot
from .serializers import LotSerializer
from rest_framework.permissions import IsAuthenticated

class LotViewSet(viewsets.ModelViewSet):
    queryset = Lot.objects.all()
    serializer_class = LotSerializer
    permission_classes = [IsAuthenticated]


# paraiso360_backend/apps/inventory/lots/views.py
from rest_framework import viewsets
from .models import Lot
from .serializers import LotSerializer
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

class LotViewSet(viewsets.ModelViewSet):
    queryset = Lot.objects.all()
    serializer_class = LotSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['status', 'block', 'section', 'lot_number']
    search_fields = ['lot_number', 'block', 'section']


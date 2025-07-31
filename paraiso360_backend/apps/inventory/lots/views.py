# paraiso360_backend/apps/inventory/lots/views.py
from rest_framework import viewsets
from .models import Lot
from .serializers import LotSerializer
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction


class LotViewSet(viewsets.ModelViewSet):
    queryset = Lot.objects.all()
    serializer_class = LotSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['status', 'block', 'section', 'lot_number']
    search_fields = ['lot_number', 'block', 'section']

    @action(detail=False, methods=['patch'], url_path='bulk_update')
    def bulk_update(self, request, **kwargs):
        data = request.data
        if not isinstance(data, list):
            return Response({'detail': 'Expected a list'}, status=400)
        ids = [d.get('id') for d in data]
        lots = list(Lot.objects.filter(id__in=ids))
        if len(lots) != len(ids):
            return Response({'detail': 'Some IDs not found'}, status=400)
        serializer = self.get_serializer(
            lots, data=data, many=True, partial=True)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='geojson/(?P<block_id>[^/.]+)')
    def geojson_by_block(self, request, block_id=None, version=None):
        lots = Lot.objects.filter(block__block_id=block_id)
        serializer = self.get_serializer(lots, many=True)
        return Response({
            "type": "FeatureCollection",
            "features": serializer.data
        })

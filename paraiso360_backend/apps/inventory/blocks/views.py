# paraiso360_backend/apps/inventory/blocks/views.py
from rest_framework import generics
from .models import Block
from .serializers import BlockGeoSerializer


class BlockGeoJSONView(generics.ListAPIView):
    queryset = Block.objects.all()
    serializer_class = BlockGeoSerializer

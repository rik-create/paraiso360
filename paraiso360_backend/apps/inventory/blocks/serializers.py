# paraiso360_backend/apps/inventory/blocks/serializers.py
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Block


class BlockGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Block
        geo_field = 'location'
        fields = ['id', 'block_id', 'name', 'lot_count']

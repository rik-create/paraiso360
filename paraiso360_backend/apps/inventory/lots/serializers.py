# lots/api/serializers.py
from rest_framework_gis import serializers as gis_serializers
from rest_framework import serializers
from clients.serializers import ClientSerializer
from lottypes.serializers import LotTypeSerializer
from .models import Lot
from clients.models import Client
from lottypes.models import LotType

class LotSerializer(gis_serializers.GeoFeatureModelSerializer):
    """
    Serializer for the Lot model using GeoJSON for the location field.

    - For read operations, it provides nested details for `lot_type` and `client`.
    - For write operations, it expects primary keys for `lot_type_id` and `client_id`.
    """
    # Nested serializers for read-only detailed representation
    client = ClientSerializer(read_only=True)
    lot_type = LotTypeSerializer(read_only=True)

    # Writeable fields for relationships, expecting IDs from the client
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source='client', write_only=True, allow_null=True
    )
    lot_type_id = serializers.PrimaryKeyRelatedField(
        queryset=LotType.objects.all(), source='lot_type', write_only=True
    )

    class Meta:
        model = Lot
        # The 'location' field is the geometry field for GeoJSON output
        geo_field = 'location'
        fields = [
            'id',
            'lot_number',
            'block',
            'section',
            'status',
            'location',
            'lot_type',
            'client',
            'lot_type_id', # For write operations
            'client_id',   # For write operations
        ]
        read_only_fields = ['id']
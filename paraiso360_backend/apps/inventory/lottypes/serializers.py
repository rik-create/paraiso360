# lottypes/serializers.py
from rest_framework import serializers
from .models import LotType

class LotTypeSerializer(serializers.ModelSerializer):
    """
    Serializer for the LotType model.
    Provides a complete representation of a lot type for CRUD operations.
    """
    class Meta:
        model = LotType
        fields = [
            'id',
            'type_name',
            'base_price',
            'max_fresh_body_capacity',
            'max_skeletal_remains_capacity',
            'description',
        ]
        read_only_fields = ['id']
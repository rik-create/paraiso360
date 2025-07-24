# burials/api/serializers.py
from rest_framework import serializers
from .models import Burial
from apps.inventory.lots.models import Lot

class BurialSerializer(serializers.ModelSerializer):
    """
    Serializer for the Burial model.
    """
    # Use StringRelatedField for a human-readable representation of the lot on read
    lot_str = serializers.StringRelatedField(source='lot', read_only=True)

    # Use PrimaryKeyRelatedField for associating a lot by its ID on write
    lot_id = serializers.PrimaryKeyRelatedField(
        queryset=Lot.objects.all(), source='lot', write_only=True
    )

    class Meta:
        model = Burial
        fields = [
            'id',
            'deceased_full_name',
            'date_of_birth',
            'date_of_death',
            'date_of_burial',
            'remains_type',
            'lot_str', # read-only representation
            'lot_id',  # write-only representation
        ]
        read_only_fields = ['id']
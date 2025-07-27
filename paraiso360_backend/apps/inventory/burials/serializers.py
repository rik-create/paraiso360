# paraiso360_backend/apps/inventory/burials/serializers.py
from rest_framework import serializers
from .models import Burial
from django.db import transaction
from ..lots.models import LotOccupancyHistory, Lot


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
            'lot_str',  # read-only representation
            'lot_id',  # write-only representation
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        lot = validated_data['lot']
        remains_type = validated_data['remains_type']

        with transaction.atomic():
            # Step 1: Update lot counts
            if remains_type == 'Fresh':
                lot.fresh_body_count += 1
            elif remains_type == 'Skeletal':
                lot.skeletal_remains_count += 1

            # Step 2: Check for capacity and update status if full
            fresh_full = lot.fresh_body_count >= lot.lot_type.max_fresh_body_capacity
            skeletal_full = lot.skeletal_remains_count >= lot.lot_type.max_skeletal_remains_capacity

            if fresh_full and skeletal_full:
                lot.status = 'Full'

            lot.save()

            # Step 3: Save burial
            burial = super().create(validated_data)

            # Step 4: Save history record
            LotOccupancyHistory.objects.create(
                lot=lot,
                burial=burial,
                remains_type=remains_type,
                change=1
            )

            return burial

# payments/api/serializers.py
from rest_framework import serializers
from .models import Payment
from ..clients.models import Client
from ..lots.models import Lot


class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Payment model.
    """
    # Human-readable representations for read operations
    client_name = serializers.CharField(
        source='client.full_name', read_only=True)
    lot_str = serializers.StringRelatedField(source='lot', read_only=True)

    # Writeable fields for relationships by ID
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source='client', write_only=True
    )
    lot_id = serializers.PrimaryKeyRelatedField(
        queryset=Lot.objects.all(), source='lot', write_only=True
    )

    class Meta:
        model = Payment
        fields = [
            'id',
            'amount',
            'payment_date',
            'status',
            'notes',
            'client_name',
            'lot_str',
            'client_id',
            'lot_id',
        ]
        read_only_fields = ['id', 'payment_date']

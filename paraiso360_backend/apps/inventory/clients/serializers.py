# clients/serializers.py
from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    """
    Serializer for the Client model.
    Handles creation, reading, and updating of client records.
    """
    class Meta:
        model = Client
        fields = [
            'id',
            'full_name',
            'contact_number',
            'email_address',
            'mailing_address',
        ]
        read_only_fields = ['id']
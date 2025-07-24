# notifications/api/serializers.py
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Notification model. Mostly read-only as notifications
    are typically system-generated.
    """
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'message',
            'created_at',
            'is_read',
            'user_username',
            'related_entity_type',
            'related_entity_id',
        ]
        # Make most fields read-only, allowing only 'is_read' to be updated.
        read_only_fields = [
            'id', 'message', 'created_at', 'user_username',
            'related_entity_type', 'related_entity_id'
        ]
# auditlogs/serializers.py
from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for the AuditLog model.
    Audit logs should not be created or modified via the API.
    """
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id',
            'timestamp',
            'action_type',
            'entity_affected',
            'record_id',
            'change_details',
            'user_username',
        ]
        # Make the entire serializer read-only.
        read_only_fields = fields
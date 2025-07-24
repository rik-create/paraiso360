# roles/serializers.py
from rest_framework import serializers
from .models import Role

class RoleSerializer(serializers.ModelSerializer):
    """
    Serializer for the Role model.
    """
    class Meta:
        model = Role
        fields = ['id', 'role_name']
        read_only_fields = ['id']
# users/api/serializers.py
from rest_framework import serializers
from .models import AppUser
from roles.models import Role

class AppUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom AppUser model.
    Handles password securely by making it write-only.
    """
    # Read-only field to show the role name instead of just the ID
    role_name = serializers.CharField(source='role.role_name', read_only=True)

    # Write-only fields for setting relationships and sensitive data
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), source='role', write_only=True
    )
    # The 'password_hash' field is abstractly named 'password' in the API
    # for simplicity. It should never be read from the API.
    password = serializers.CharField(
        write_only=True, required=True, source='password_hash'
    )

    class Meta:
        model = AppUser
        fields = [
            'id',
            'username',
            'full_name',
            'role_name',
            'role_id',
            'password',
        ]
        read_only_fields = ['id']
    
    # In a real application, you would override create() and update() to
    # properly hash the password before saving.
    # def create(self, validated_data):
    #     validated_data['password_hash'] = make_password(validated_data['password_hash'])
    #     return super().create(validated_data)
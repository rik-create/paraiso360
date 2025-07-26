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

        def validate_contact_number(self, value):
            if not value:
                raise serializers.ValidationError(
                    "Contact number is required.")

            cleaned_number = value.replace(
                ' ', '').replace('-', '').replace('+', '')

            if not cleaned_number.isdigit():
                raise serializers.ValidationError(
                    "Enter a valid phone number (e.g., +639171234567 or 09171234567).")

            if len(cleaned_number) < 10:
                raise serializers.ValidationError(
                    "Enter a valid phone number (e.g., +639171234567 or 09171234567).")

            return value

        def validate_email_address(self, value):
            if not value:
                raise serializers.ValidationError("Email address is required.")

            if '@' not in value or '.' not in value.split('@')[-1]:
                raise serializers.ValidationError(
                    "Please enter a valid email address.")

            return value

        def validate_full_name(self, value):
            if not value or not value.strip():
                raise serializers.ValidationError("Full name is required.")

            if len(value.strip()) < 2:
                raise serializers.ValidationError(
                    "Full name must be at least 2 characters long.")

            return value.strip()

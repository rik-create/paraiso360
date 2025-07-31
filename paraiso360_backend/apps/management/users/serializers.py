# paraiso360_backend/apps/management/users/serializers.py
from rest_framework import serializers
from .models import AppUser, Profile
from ..roles.models import Role
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# for getting role id which can be used in role-based access control


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['role_id'] = user.role_id
        token['full_name'] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Include role_id in the response body too
        data['role_id'] = self.user.role_id
        data['full_name'] = self.user.full_name
        return data


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'birth_date', 'phone_number', 'address']
        extra_kwargs = {
            'bio': {'required': False},
            'birth_date': {'required': False},
            'phone_number': {'required': False},
            'address': {'required': False},
        }


class AppUserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.role_name', read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), source='role', write_only=True
    )
    password = serializers.CharField(
        write_only=True, required=True, source='password_hash')
    profile = ProfileSerializer(required=False)

    class Meta:
        model = AppUser
        fields = ['id', 'username', 'full_name',
                  'role_name', 'role_id', 'password', 'profile']
        read_only_fields = ['id']

# to create or update the user and profile in one go
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        password_hash = validated_data.pop('password_hash')

        try:
            validate_password(password_hash)
        except DjangoValidationError as e:
            raise DRFValidationError({'password': list(e.messages)})

        user = AppUser(**validated_data)
        user.set_password(password_hash)
        user.save()
        Profile.objects.update_or_create(user=user, defaults=profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        password_hash = validated_data.pop('password_hash', None)

        if password_hash:
            try:
                validate_password(password_hash, user=instance)
            except DjangoValidationError as e:
                raise DRFValidationError({'password': list(e.messages)})
            instance.set_password(password_hash)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        if profile_data:
            Profile.objects.update_or_create(
                user=instance, defaults=profile_data)
        return instance

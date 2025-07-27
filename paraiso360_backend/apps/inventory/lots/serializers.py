# paraiso360_backend/apps/inventory/lots/serializers.py
from rest_framework_gis import serializers as gis_serializers
from rest_framework import serializers
from ..clients.serializers import ClientSerializer
from ..lottypes.serializers import LotTypeSerializer
from .models import Lot
from ..clients.models import Client
from ..lottypes.models import LotType
from django.contrib.gis.geos import Point


class LotListSerializer(serializers.ListSerializer):

    def to_internal_value(self, data):
        if not isinstance(data, list):
            raise serializers.ValidationError('Expected a list of items.')

        ret = []
        errors = []

        id_instance_map = {
            str(obj.id): obj for obj in self.instance} if self.instance else {}

        for item in data:
            try:
                instance = id_instance_map.get(str(item.get('id')))
                serializer = self.child
                serializer.instance = instance
                validated = serializer.to_internal_value(item)
                if instance and hasattr(instance, "id"):
                    validated['id'] = instance.id
                ret.append(validated)
                errors.append({})
            except serializers.ValidationError as exc:
                errors.append(exc.detail)
            except Exception:
                errors.append({'non_field_errors': ['Invalid input.']})

        if any(errors):
            raise serializers.ValidationError(errors)

        return ret

    def update(self, instances, validated_data):
        lot_mapping = {lot.id: lot for lot in instances}
        updated_lots = []

        for data in validated_data:
            lot = lot_mapping.get(data.get('id'))
            if not lot:
                continue

            serializer = self.child.__class__(
                lot, data=data, partial=True, context=self.context)
            serializer.is_valid(raise_exception=True)

            validated = serializer.validated_data

            location_data = validated.get('location')
            if isinstance(location_data, dict):
                coords = location_data.get('coordinates', [])
                if len(coords) == 2:
                    validated['location'] = Point(coords[0], coords[1])

            for attr, value in validated.items():
                setattr(lot, attr, value)
            updated_lots.append(lot)

        Lot.objects.bulk_update(updated_lots, fields=[
            field for field in validated_data[0].keys() if field != 'id'
        ])
        return updated_lots


class LotSerializer(gis_serializers.GeoFeatureModelSerializer):
    """
    Serializer for the Lot model using GeoJSON for the location field.

    - For read operations, it provides nested details for `lot_type` and `client`.
    - For write operations, it expects primary keys for `lot_type_id` and `client_id`.
    """
    # Nested serializers for read-only detailed representation
    client = ClientSerializer(read_only=True)
    lot_type = LotTypeSerializer(read_only=True)

    # Writeable fields for relationships, expecting IDs from the client
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source='client', write_only=True, allow_null=True
    )
    lot_type_id = serializers.PrimaryKeyRelatedField(
        queryset=LotType.objects.all(), source='lot_type', write_only=True
    )

    # Read-only fields for capacity status
    is_full = serializers.SerializerMethodField()
    near_capacity = serializers.SerializerMethodField()

    class Meta:
        model = Lot
        # The 'location' field is the geometry field for GeoJSON output
        geo_field = 'location'
        fields = [
            'id',
            'lot_number',
            'block',
            'section',
            'status',
            'location',
            'lot_type',
            'client',
            'lot_type_id',  # For write operations
            'client_id',   # For write operations
            'fresh_body_count',
            'skeletal_remains_count',
            'is_full',
            'near_capacity',
        ]
        read_only_fields = ['id', 'is_full', 'near_capacity']
        list_serializer_class = LotListSerializer

    def get_is_full(self, instance):
        """
        A lot is full only when both fresh body and skeletal remains have reached capacity.
        """
        if not instance.lot_type:
            return False

        fresh_full = instance.fresh_body_count >= instance.lot_type.max_fresh_body_capacity
        skeletal_full = instance.skeletal_remains_count >= instance.lot_type.max_skeletal_remains_capacity

        return fresh_full and skeletal_full

    def get_near_capacity(self, instance):
        """
        A lot is near capacity when either fresh body or skeletal remains is at 80% capacity.
        """
        if not instance.lot_type:
            return False

        fresh_near = instance.fresh_body_count >= (
            instance.lot_type.max_fresh_body_capacity * 0.8)
        skeletal_near = instance.skeletal_remains_count >= (
            instance.lot_type.max_skeletal_remains_capacity * 0.8)

        return fresh_near or skeletal_near

    def create(self, validated_data):
        location_data = validated_data.get('location')
        if isinstance(location_data, dict):
            coords = location_data.get('coordinates', [])
            if len(coords) == 2:
                validated_data['location'] = Point(coords[0], coords[1])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        location_data = validated_data.get('location')
        if isinstance(location_data, dict):
            coords = location_data.get('coordinates', [])
            if len(coords) == 2:
                validated_data['location'] = Point(coords[0], coords[1])
        return super().update(instance, validated_data)

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)

        # Validate status is one of the allowed values
        allowed_statuses = ['Available', 'Reserve', 'Sold']
        new_status = attrs.get('status')
        if new_status and new_status not in allowed_statuses:
            raise serializers.ValidationError({
                'status': f'Status must be one of: {", ".join(allowed_statuses)}'
            })

        # Status change rule
        if instance and new_status:
            if instance.status == 'Sold' and new_status == 'Sold':
                raise serializers.ValidationError({
                    'status': 'Lot is already sold and cannot be marked sold again.'
                })

        # Occupancy capacity validation
        lot_type = instance.lot_type if instance else attrs.get('lot_type')
        fresh_body_count = attrs.get(
            'fresh_body_count', instance.fresh_body_count if instance else 0)
        skeletal_remains_count = attrs.get(
            'skeletal_remains_count', instance.skeletal_remains_count if instance else 0)

        if lot_type:
            # Hard validation - prevent exceeding capacity
            if fresh_body_count > lot_type.max_fresh_body_capacity:
                raise serializers.ValidationError({
                    'fresh_body_count': f'Exceeds capacity ({lot_type.max_fresh_body_capacity})'
                })
            if skeletal_remains_count > lot_type.max_skeletal_remains_capacity:
                raise serializers.ValidationError({
                    'skeletal_remains_count': f'Exceeds capacity ({lot_type.max_skeletal_remains_capacity})'
                })

        return super().validate(attrs)

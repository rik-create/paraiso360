# paraiso360_backend/apps/inventory/lots/admin.py
from django.contrib import admin
from .models import Lot
from ..burials.admin import BurialInline


@admin.register(Lot)
class LotAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'lot_number',
        'block',
        'section',
        'status',
        'client',
        'lot_type',
        'fresh_body_usage',
        'skeletal_remains_usage'
    ]

    readonly_fields = ['fresh_body_usage', 'skeletal_remains_usage']
    inlines = [BurialInline]

    def fresh_body_usage(self, obj):
        if obj and obj.lot_type:
            used = obj.fresh_body_count
            max_capacity = obj.lot_type.max_fresh_body_capacity
            return f"{used}/{max_capacity}"
        return "-"
    fresh_body_usage.short_description = "Fresh Usage"

    def skeletal_remains_usage(self, obj):
        if obj and obj.lot_type:
            used = obj.skeletal_remains_count
            max_capacity = obj.lot_type.max_skeletal_remains_capacity
            return f"{used}/{max_capacity}"
        return "-"
    skeletal_remains_usage.short_description = "Skeletal Usage"

from django.contrib import admin
from .models import Lot


@admin.register(Lot)
class LotAdmin(admin.ModelAdmin):
    list_display = ['id', 'lot_number', 'block',
                    'section', 'status', 'client', 'lot_type']

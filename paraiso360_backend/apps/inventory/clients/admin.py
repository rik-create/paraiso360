from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    search_fields = ['full_name', 'contact_number', 'lots__lot_number']

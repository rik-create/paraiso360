from django.contrib import admin
from .models import Burial


class BurialInline(admin.TabularInline):
    model = Burial
    extra = 1
    fields = ['deceased_full_name', 'date_of_birth',
              'date_of_death', 'date_of_burial', 'remains_type']

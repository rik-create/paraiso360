from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import AppUser
from .models import Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


@admin.register(AppUser)
class AppUserAdmin(UserAdmin):
    inlines = (ProfileInline,)
    readonly_fields = ('last_login', 'date_joined')
    model = AppUser
    list_display = ('id', 'username', 'email', 'full_name', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')

    fieldsets = (
        ("Basic Info", {
            'fields': ('username', 'password')
        }),
        ("Personal Info", {
            'fields': ('full_name', 'role', 'email',)
        }),
        ("Permissions", {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ("Important Dates", {
            'fields': ('last_login', 'date_joined')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'full_name', 'role', 'email', 'is_staff', 'is_active'),
        }),
    )

    search_fields = ('username', 'email', 'full_name')
    ordering = ('id',)


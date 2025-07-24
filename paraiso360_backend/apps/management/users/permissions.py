# paraiso360/paraiso360_backend/apps/management/users/permissions.py
from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role.role_name == 'Admin'


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role.role_name in ['Staff', 'Admin']

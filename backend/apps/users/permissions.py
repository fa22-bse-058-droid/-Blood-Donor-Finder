from rest_framework.permissions import BasePermission

class IsDonor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'donor'

class IsHospital(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'hospital'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsEmergencyCoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'emergency_coordinator'

class IsAdminOrCoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'emergency_coordinator']
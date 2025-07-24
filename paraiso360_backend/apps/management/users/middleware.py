# paraiso360_backend/apps/management/users/middleware.py
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class JWTSessionValidationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Check session is active
        if not request.session.session_key:
            return

        # Check JWT token validity
        auth = JWTAuthentication()
        header = auth.get_header(request)
        if header is None:
            return

        try:
            user_auth_tuple = auth.get_user(request)
            request.user = user_auth_tuple
        except (InvalidToken, TokenError):
            from django.http import JsonResponse
            return JsonResponse({'detail': 'Invalid or expired token.'}, status=401)

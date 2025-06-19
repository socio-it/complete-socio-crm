from urllib.parse import urlencode
from django.http import JsonResponse
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from rest_framework.response import Response
from django_auth_adfs.rest_framework import AdfsAccessTokenAuthentication
from rest_framework.permissions import IsAuthenticated


class AuthenticateView(APIView):
    authentication_classes = []#AdfsAccessTokenAuthentication
    permission_classes = []#IsAuthenticated

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            "message": "Autenticación exitosa con Azure AD",
            "username": "brian",
            "email": getattr(user, 'email', None),
        })


# === LOGIN SUCCESSFUL ===
"""

def login_successful(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not authenticated"}, status=401)

    # Generate an application JWT for the logged in user
    jwt = RefreshToken.for_user(request.user)

    user = {
        'email': request.user.email or request.user.username,
        'id': request.user.id,
        'name': f'{request.user.first_name} {request.user.last_name}',
        'role': 'Admin'
    }

    params = urlencode({
        'token': str(jwt.access_token),
        'email': user['email'],
        'name': user['name'],
        'role': user['role']
    })

    return redirect(f"http://localhost:3000/register-token?{params}")



from rest_framework.views import APIView
import requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class MSALLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        print(access_token  )
        if not access_token:
            return Response({"error": "Missing token"}, status=400)

        graph = requests.get(
            'https://graph.microsoft.com/v1.0/me',
            headers={'Authorization': f'Bearer {access_token}'}
        ).json()

        email = graph.get("userPrincipalName") or graph.get("mail")
        first_name = graph.get("givenName", "")
        last_name = graph.get("surname", "")

        if not email:
            return Response({"error": "Email not found in token"}, status=400)

        user, _ = User.objects.get_or_create(
            email=email,
            defaults={"username": email, "first_name": first_name, "last_name": last_name}
        )

        jwt = RefreshToken.for_user(user)

        return Response({
            "token": str(jwt.access_token),
            "user": {
                "email": user.email,
                "name": f"{user.first_name} {user.last_name}",
                "role": "Admin"
            }
        })
        """
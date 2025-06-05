from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('accounts/', include('allauth.urls')),
    path("api/oauth2/", include("django_auth_adfs.urls")),
    path('', views.login_successful, name='login'),
    path('api/auth/msal-login/', views.MSALLoginView.as_view(), name='msal-login'),
]

from django.contrib import admin
from django.urls import path, include

from core import views
from apps.lite_store import urls as lite_store_views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('accounts/', include('allauth.urls')),
    path("api/oauth2/", include("django_auth_adfs.urls")),
    path('', views.login_successful, name='login'),
    path('api/auth/msal-login/', views.MSALLoginView.as_view(), name='msal-login'),
    
    path("api/lite_store/", include(lite_store_views.urls)),
    
]

from django.urls import path

from . import views

urls = [
    path("take_data/", views.JWTTakeInformationAuth.as_view())
]
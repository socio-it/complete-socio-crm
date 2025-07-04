from django.urls import path

from . import views

urls = [
    path("get_emails/<date_from>/<date_to>", views.JWTGetEmailsAuth.as_view())
]
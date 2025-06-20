from django.urls import path

from . import views

urls = [
    path("take_data/", views.JWTTakeInformationAuth.as_view()),
    path("get_transcriptions/", views.JWTManageTeamsMeetingsAuth.as_view()),
    path("get_consultant/", views.JWTMakeProblemAnalysisAuth.as_view())
]
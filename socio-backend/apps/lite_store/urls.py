from django.urls import path

from . import views

urls = [
    path("take_data/", views.JWTTakeInformationAuth.as_view()),
    path("get_transcriptions/", views.JWTManageTeamsMeetingsAuth.as_view()),
    path("get_consultant/", views.JWTMakeProblemAnalysisAuth.as_view()),

    path("get_tenant_tasks/", views.PerformanceEvaluationTemplateCreate.as_view()),
    path("get_tenant_tasks/<pk>", views.PerformanceEvaluationTemplateDetail.as_view()),
    
    path("execute_task/<pk>", views.ExecuteTaskViews.as_view())
]
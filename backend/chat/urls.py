from django.urls import path
from .views import *

urlpatterns = [
    path("analyze/", ChatbotAnalyzeView.as_view(), name="chatbot-analyze"),
]

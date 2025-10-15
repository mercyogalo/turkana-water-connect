from django.urls import path
from .views import WaterSourceListView

urlpatterns = [
    path('watersources/', WaterSourceListView.as_view(), name='water-source-list'),
]

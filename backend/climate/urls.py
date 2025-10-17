from django.urls import path
from .views import WaterSourceListView, ContactMessageCreateView

urlpatterns = [
    path('watersources/', WaterSourceListView.as_view(), name='water-source-list'),
    path('contact/', ContactMessageCreateView.as_view(), name='contact-message-create'),
]

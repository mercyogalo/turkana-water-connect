from django.shortcuts import render
from rest_framework import generics
from .models import WaterSource, ContactMessage
from .serializers import WaterSourceSerializer, ContactMessageSerializer

class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

class WaterSourceListView(generics.ListAPIView):
    queryset = WaterSource.objects.all()
    serializer_class = WaterSourceSerializer

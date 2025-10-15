from django.shortcuts import render
from rest_framework import generics
from .models import WaterSource
from .serializers import WaterSourceSerializer

class WaterSourceListView(generics.ListAPIView):
    queryset = WaterSource.objects.all()
    serializer_class = WaterSourceSerializer

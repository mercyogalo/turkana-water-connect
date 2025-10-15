from rest_framework import serializers
from .models import WaterSource

class WaterSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterSource
        fields = '__all__'

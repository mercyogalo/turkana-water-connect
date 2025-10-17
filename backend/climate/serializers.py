from rest_framework import serializers
from .models import WaterSource, ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['created_at']

class WaterSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterSource
        fields = '__all__'

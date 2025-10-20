from rest_framework import serializers
from .models import *


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = "__all__"


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField()

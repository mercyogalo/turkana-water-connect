from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from .serializers import *
from .models import ChatMessage
from .utils import get_bot_response
import re

from datetime import timedelta
from django.utils import timezone


class ChatbotAnalyzeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        if serializer.is_valid():
            now = timezone.now()
            start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)

            # recent_messages = ChatMessage.objects.filter(
            #     created_at__gte=start_of_day
            # ).count()

            # if not request.user.is_subscribed and recent_messages >= two_msg_limit:
            #     # if recent_messages >= two_msg_limit:
            #     return Response(
            #         {
            #             "error": "You've reached your daily limit of 10 messages. Please subscribe to continue chatting."
            #         },
            #         status=403,
            #     )
            #
            #

            # Continue as normal
            user_msg = serializer.validated_data["message"]
            bot_msg = get_bot_response(user_msg)

          
            clean_bot_msg = re.sub(r'\*{1,2}', '', bot_msg)



            chat = ChatMessage.objects.create(
                user_message=user_msg, bot_response= clean_bot_msg
            )

            return Response(ChatMessageSerializer(chat).data)
        return Response(serializer.errors, status=400)

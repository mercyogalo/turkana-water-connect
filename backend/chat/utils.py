import openai
import requests
from django.conf import settings


GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


def get_bot_response(user_message: str) -> str:
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    data = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [
            {
                "role": "system",
                "content": "You are a water access support.You help people understand the questions they have on the weather graphs, weather predictions, explain the different weather seasons and what they mean and the different water sources they can access.Use the data from different sources which are relevant. If an individual ask about water sources answer based on the person's location by providing the nearest water source available. Dont keep mentioning your name Water support when giving responses",
            },
            {
                "role": "user",
                "content": user_message,
            },
        ],
        "temperature": 0.7,
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        print("GROQ API Error:", response.status_code, response.text)
        return (
            "Sorry, I couldn't process your request right now. Please try again later."
        )

import os
import google.generativeai as genai

class Config:
    # It's better to load the API key from environment variables
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or "AIzaSyAJFnkMklqqLygOguR0RZYstW3TSPQpa1w"

# Configure Gemini
genai.configure(api_key=Config.GEMINI_API_KEY)

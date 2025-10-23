#!/usr/bin/env python3
"""
Setup script for Gemini API key
Run this to set up your Gemini API key
"""

import os

def setup_gemini_api_key():
    print("🔑 Gemini API Key Setup")
    print("=" * 50)
    print("To get a free Gemini API key:")
    print("1. Go to: https://makersuite.google.com/app/apikey")
    print("2. Sign in with your Google account")
    print("3. Click 'Create API Key'")
    print("4. Copy the generated API key")
    print()
    
    api_key = input("Enter your Gemini API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided. Exiting.")
        return
    
    # Create .env file
    env_content = f"""# Gemini API Configuration
GEMINI_API_KEY={api_key}

# Voice Analysis
VOICE_MODEL_PATH=./models/voice_emotion_model.pkl
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ API key saved to .env file")
        print("🔄 Please restart your server for changes to take effect")
    except Exception as e:
        print(f"❌ Error saving API key: {e}")
        print("Please create a .env file manually with:")
        print(f"GEMINI_API_KEY={api_key}")

if __name__ == "__main__":
    setup_gemini_api_key()

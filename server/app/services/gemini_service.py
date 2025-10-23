# app/services/gemini_service.py

import google.generativeai as genai
import os
from datetime import datetime
import time

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-gemini-api-key-here')
genai.configure(api_key=GEMINI_API_KEY)

print("Gemini API configured with dynamic therapy AI")
# app/services/gemini_service.py (REPLACE lines 15-25)

def generate_gemini_response(user_message, mental_data, voice_data, conversation_history, mode='chat'):
    """
    DYNAMIC AI Therapist that adapts to YOUR specific situation in real-time
    """
    try:
        # ✅ STEP 1: Get ALL user data (not hardcoded!)
        
        # Daily check-in data
        mood = mental_data.get('mental_health', {}).get('mood_today')
        stress = mental_data.get('mental_health', {}).get('stress')
        sleep = mental_data.get('mental_health', {}).get('sleep_hours')
        energy = mental_data.get('mental_health', {}).get('energy')
        
        # Onboarding profile data
        profile = mental_data.get('user_profile', {})
        name = profile.get('name')
        age = profile.get('age')
        gender = profile.get('gender')
        occupation = profile.get('occupation')
        workspace = profile.get('workspace')
        sleep_habits = profile.get('sleep_habits')
        physical_activities = profile.get('physical_activities')
        screen_time = profile.get('screen_time')
        has_mental_issue = profile.get('has_mental_issue')
        mental_issue_details = profile.get('mental_issue_details')
        
        # Data availability flags
        has_checkin = mental_data.get('has_checkin_data', False)
        has_profile = mental_data.get('has_onboarding_data', False)
        
        # STEP 2: Build conversation history (same as before)
        conversation_context = ""
        if conversation_history and len(conversation_history) > 0:
            conversation_context = "📜 WHAT WE'VE TALKED ABOUT:\n"
            recent = conversation_history[-8:]
            for msg in recent:
                role = "You (NeuroWell)" if msg['role'] == 'assistant' else "User"
                conversation_context += f"{role}: {msg['content']}\n"
        
        # STEP 3: Analyze voice emotions (same as before)
        voice_insights = ""
        if voice_data:
            emotions = []
            if voice_data.get('stressed', 0) > 70:
                emotions.append(f"HIGHLY STRESSED (voice: {voice_data['stressed']:.0f}%)")
            if voice_data.get('frustrated', 0) > 60:
                emotions.append(f"FRUSTRATED ({voice_data['frustrated']:.0f}%)")
            if voice_data.get('anxious', 0) > 65:
                emotions.append(f"ANXIOUS ({voice_data['anxious']:.0f}%)")
            if voice_data.get('sad', 0) > 70:
                emotions.append(f"SAD ({voice_data['sad']:.0f}%)")
            if voice_data.get('angry', 0) > 60:
                emotions.append(f"ANGRY ({voice_data['angry']:.0f}%)")
            
            if emotions:
                voice_insights = f"🎙 VOICE EMOTION: {', '.join(emotions)}\n"
        
        # ✅ STEP 4: Check for CRISIS indicators (using REAL data now!)
        crisis_indicators = []
        if mood and mood <= 2:
            crisis_indicators.append("severe depression symptoms")
        if stress and stress >= 9:
            crisis_indicators.append("extreme stress overload")
        if sleep and sleep < 3:
            crisis_indicators.append("critical sleep deprivation")
        if any(word in user_message.lower() for word in ["suicid", "kill myself", "end it", "want to die"]):
            crisis_indicators.append("CRISIS ALERT - self-harm thoughts")
        if any(word in user_message.lower() for word in ["can't take it", "give up", "hopeless"]):
            crisis_indicators.append("giving up signals")
        
        # ✅ STEP 5: Detect specific problems (same as before)
        problem_detected = None
        if any(word in user_message.lower() for word in ["fight", "argument", "argued"]):
            problem_detected = "RELATIONSHIP CONFLICT"
        elif any(word in user_message.lower() for word in ["work", "job", "boss", "deadline", "project"]):
            problem_detected = "WORK STRESS"
        elif any(word in user_message.lower() for word in ["can't sleep", "insomnia", "awake", "tired"]):
            problem_detected = "SLEEP ISSUES"
        elif any(word in user_message.lower() for word in ["anxious", "anxiety", "panic", "worried"]):
            problem_detected = "ANXIETY"
        elif any(word in user_message.lower() for word in ["lonely", "alone", "isolated", "no friends"]):
            problem_detected = "LONELINESS"
        elif any(word in user_message.lower() for word in ["breakup", "broke up", "relationship ended"]):
            problem_detected = "BREAKUP/HEARTBREAK"
        elif any(word in user_message.lower() for word in ["family", "parents", "mom", "dad"]):
            problem_detected = "FAMILY ISSUES"
        
        # STEP 6: Select model based on situation (same as before)
        if crisis_indicators:
            model_name = 'gemini-1.5-pro-latest'
            use_search = True
            print("🚨 Crisis detected - using Pro model with search")
        elif problem_detected:
            model_name = 'gemini-1.5-flash-latest'
            use_search = True
            print("🤔 Problem-solving mode - using Flash with search")
        else:
            model_name = 'gemini-2.5-flash'
            use_search = False
        
        # STEP 7: Create model (same as before)
        if use_search:
            model = genai.GenerativeModel(model_name, tools='google_search_retrieval')
        else:
            model = genai.GenerativeModel(model_name)
        
        # ✅ STEP 8: Build prompt with ALL user data
        if mode == 'proactive':
            prompt = f"""You are NeuroWell, a caring AI mental health friend who checks in when something seems wrong.

USER'S DATA SHOWING CONCERN:
- Mood: {mood if mood else 'Not reported'}/10 (dropped significantly)
- Stress: {stress if stress else 'Not reported'}/10 (high)
- Sleep: {sleep if sleep else 'Not reported'} hours (poor)
- Energy: {energy if energy else 'Not reported'}/10 (low)

Start a warm, brief conversation (2-3 sentences). Show you care and ask what's happening."""

        else:
            # ✅ Build user context with ALL available data
            user_context = f"""USER'S PROFILE:
- Name: {name if name else 'Unknown'}
- Age: {age if age else 'Unknown'}, Gender: {gender if gender else 'Unknown'}
- Occupation: {occupation if occupation else 'Unknown'} ({workspace if workspace else 'Unknown workspace'})
- Sleep Habits: {sleep_habits if sleep_habits else 'Unknown'}
- Physical Activities: {physical_activities if physical_activities else 'Unknown'}
- Screen Time: {screen_time if screen_time else 'Unknown'} hours/day
- Has Mental Health Issues: {has_mental_issue if has_mental_issue else 'Not specified'}
{f"- Mental Issue Details: {mental_issue_details}" if mental_issue_details else ""}

CURRENT STATE TODAY:
- Mood: {mood if mood else 'Not reported yet'}/10
- Stress: {stress if stress else 'Not reported yet'}/10
- Sleep: {sleep if sleep else 'Not reported yet'} hours
- Energy: {energy if energy else 'Not reported yet'}/10
{voice_insights}"""

            prompt = f"""You are NeuroWell, an AI mental health companion. You're smart, empathetic, and ACTUALLY HELPFUL.

{conversation_context}

{user_context}

USER JUST SAID: "{user_message}"

{"🚨 CRISIS INDICATORS: " + ", ".join(crisis_indicators) if crisis_indicators else ""}
{"🎯 DETECTED PROBLEM: " + problem_detected if problem_detected else ""}

YOUR JOB - BE DYNAMIC AND ADAPTIVE:

1. *USE THEIR PROFILE DATA*:
   - If they have mental health history ({mental_issue_details}), acknowledge it
   - Consider their occupation ({occupation}) and workspace ({workspace}) for work-related stress
   - Use their sleep habits ({sleep_habits}) to give personalized sleep advice
   - Factor in their age ({age}) and gender ({gender}) for appropriate advice

2. *IF CRISIS/SEVERE*: 
   - Immediately recommend talking to a therapist/psychiatrist
   - Provide crisis helpline: National Suicide Prevention Lifeline 988 (US)
   - Explain WHY professional help is needed
   - Don't just chat - be URGENT but caring

3. *IF SPECIFIC PROBLEM MENTIONED*:
   - Ask 1-2 specific questions to understand
   - Give CONCRETE advice with action steps
   - Example: "What did you fight about?" then "Here's what you can do: [steps]"

4. *IF USER IS VAGUE* ("yeah", "idk", "nothing"):
   - Don't repeat yourself from conversation history
   - Ask a DIFFERENT specific question
   - Example: "What's the worst moment you had today?"

5. *IF THEY NEED TECHNIQUES*:
   - Give SHORT, DO-IT-NOW exercises
   - Example: "Right now: Put feet flat on floor. Press down. Feel that? That's grounding."

6. *VOICE vs WORDS MISMATCH*:
   - If voice shows high stress but words don't, call it out gently

7. *MEDICATION/THERAPY RECOMMENDATIONS*:
   - If mood ≤3 for multiple days → "Consider seeing a psychiatrist"
   - If stress ≥8 consistently → "Therapy (especially CBT) could help"
   - If they already have mental health issues ({has_mental_issue}), suggest following up with their provider

8. *RESPONSE LENGTH*:
   - Crisis: 4-6 sentences
   - Problem-solving: 5-8 sentences
   - Check-in: 2-3 sentences

9. *TONE*:
   - Natural, like texting a friend
   - Use their name ({name}) occasionally
   - Use contractions, casual language
   - No fluff - give actual help

NOW RESPOND:"""

        # STEP 9: Generate response with retry (same as before)
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = model.generate_content(prompt)
                bot_response = response.text.strip()
                print(f"✅ Dynamic response generated: {bot_response[:100]}...")
                return bot_response
            except Exception as retry_error:
                if "Quota exceeded" in str(retry_error) and attempt < max_retries - 1:
                    wait_time = 5 * (attempt + 1)
                    print(f"⏳ Quota limit hit, waiting {wait_time}s before retry...")
                    time.sleep(wait_time)
                else:
                    raise
        
    except Exception as e:
        print(f"❌ Gemini error: {e}")
        import traceback
        traceback.print_exc()
        
        # Smart fallback
        if mode == 'proactive':
            return "Hey, I noticed your mood dropped and stress is high. What's going on?"
        elif "fight" in user_message.lower() or "argument" in user_message.lower():
            return "Tell me what happened in the fight - what was it about?"
        else:
            return "I'm listening. What's the main thing bothering you right now?"
# app/services/gemini_service.py

import google.generativeai as genai
import os
from datetime import datetime
import time

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-gemini-api-key-here')

# Check if API key is valid
if GEMINI_API_KEY == 'your-gemini-api-key-here' or not GEMINI_API_KEY:
    print("⚠️ WARNING: Gemini API key not set! Please set GEMINI_API_KEY environment variable.")
    print("   You can get a free API key from: https://makersuite.google.com/app/apikey")
    API_KEY_VALID = False
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        # Test the API key by creating a simple model
        test_model = genai.GenerativeModel('gemini-1.5-flash')
        API_KEY_VALID = True
        print("✅ Gemini API configured successfully")
    except Exception as e:
        print(f"❌ Gemini API key invalid: {e}")
        API_KEY_VALID = False

def get_fallback_response(user_message, mental_data, voice_data, conversation_history, mode='chat'):
    """
    Fallback responses when Gemini API is not available
    """
    print("🔄 Using fallback response system (Gemini API not available)")
    
    # Get basic user data
    mood = mental_data.get('mental_health', {}).get('mood_today', 5)
    stress = mental_data.get('mental_health', {}).get('stress', 5)
    
    # Simple keyword-based responses
    message_lower = user_message.lower()
    
    if mode == 'proactive':
        return f"I noticed your mood is at {mood}/10 and stress at {stress}/10. What's been going on lately?"
    
    # Exam-related responses
    if any(word in message_lower for word in ['exam', 'test', 'study', 'studying']):
        return "Exams can be really stressful! Here are some quick tips:\n\n1. **Break it down**: Study in 25-minute chunks with 5-minute breaks\n2. **Get enough sleep**: Your brain needs rest to process information\n3. **Stay hydrated**: Dehydration affects concentration\n4. **Practice breathing**: 4 seconds in, 4 seconds hold, 4 seconds out\n\nWhat subject are you most worried about?"
    
    # Stress-related responses
    elif any(word in message_lower for word in ['stress', 'stressed', 'overwhelmed', 'pressure']):
        return "I hear you're feeling stressed. That's completely normal, especially during exams. Try this:\n\n**Right now**: Take 3 deep breaths and name 3 things you can see around you.\n\n**For ongoing stress**:\n- Set small, achievable goals\n- Take regular breaks\n- Talk to someone you trust\n\nWhat's the biggest source of stress right now?"
    
    # Sleep-related responses
    elif any(word in message_lower for word in ['sleep', 'tired', 'exhausted', 'insomnia']):
        return "Sleep is crucial for exam performance! Try these:\n\n**Tonight**:\n- No screens 1 hour before bed\n- Keep your room cool and dark\n- Try the 4-7-8 breathing technique\n\n**If you can't sleep**: Don't force it. Get up, do something relaxing for 20 minutes, then try again.\n\nHow many hours of sleep are you getting?"
    
    # Anxiety-related responses
    elif any(word in message_lower for word in ['anxious', 'anxiety', 'nervous', 'panic', 'worried']):
        return "Anxiety before exams is so common. Here's what helps:\n\n**Immediate relief**:\n- Grounding technique: 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste\n- Progressive muscle relaxation\n\n**Long-term**:\n- Practice mindfulness\n- Regular exercise\n- Talk to a counselor if it's severe\n\nWhat's making you most anxious right now?"
    
    # General support
    else:
        return "I'm here to listen and help. It sounds like you're going through a tough time. Remember:\n\n- You're not alone in this\n- It's okay to ask for help\n- Small steps count\n- This feeling won't last forever\n\nWhat's the most important thing you'd like to work on right now?"

def generate_gemini_response(user_message, mental_data, voice_data, conversation_history, mode='chat'):
    """
    DYNAMIC AI Therapist that adapts to YOUR specific situation in real-time
    """
    # Check if API key is valid first
    if not API_KEY_VALID:
        return get_fallback_response(user_message, mental_data, voice_data, conversation_history, mode)
    
    try:
        # ✅ STEP 1: Get ALL user data from real wellness data
        
        # Daily check-in data (from real user data)
        mood = mental_data.get('mental_health', {}).get('mood_today')
        stress = mental_data.get('mental_health', {}).get('stress')
        sleep = mental_data.get('mental_health', {}).get('sleep_hours')
        energy = mental_data.get('mental_health', {}).get('energy')
        
        # Additional wellness insights
        mood_yesterday = mental_data.get('mental_health', {}).get('mood_yesterday')
        avg_mood = mental_data.get('mental_health', {}).get('mood', mood)
        
        # Calculate mood change
        mood_change = None
        if mood_yesterday and mood:
            mood_change = mood - mood_yesterday
        
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
        
        # STEP 2: Build conversation history with better context
        conversation_context = ""
        if conversation_history and len(conversation_history) > 0:
            conversation_context = "📜 RECENT CONVERSATION:\n"
            # Only take last 4 messages to avoid context overload
            recent = conversation_history[-4:]
            for i, msg in enumerate(recent):
                role = "NeuroWell" if msg['role'] == 'assistant' else "User"
                # Add message number to avoid repetition
                conversation_context += f"{i+1}. {role}: {msg['content']}\n"
        
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
        
        # ✅ STEP 8: Add conversation flow tracking and state management
        current_time = datetime.now().strftime("%H:%M")
        
        # Track conversation state to avoid repetition
        conversation_state = "new"
        if conversation_history and len(conversation_history) > 0:
            last_bot_message = None
            for msg in reversed(conversation_history):
                if msg['role'] == 'assistant':
                    last_bot_message = msg['content'].lower()
                    break
            
            if last_bot_message:
                if "what's going on" in last_bot_message or "what's happening" in last_bot_message:
                    conversation_state = "asked_whats_wrong"
                elif "how are you" in last_bot_message or "how do you feel" in last_bot_message:
                    conversation_state = "asked_how_feeling"
                elif "tell me" in last_bot_message or "what did" in last_bot_message:
                    conversation_state = "asked_for_details"
                else:
                    conversation_state = "ongoing"
        
        if mode == 'proactive':
            prompt = f"""You are NeuroWell, a caring AI mental health friend. It's {current_time}.

USER'S CURRENT STATE:
- Mood: {mood if mood else 'Not reported'}/10
- Stress: {stress if stress else 'Not reported'}/10  
- Sleep: {sleep if sleep else 'Not reported'} hours
- Energy: {energy if energy else 'Not reported'}/10

{conversation_context}

Start a warm, brief conversation (2-3 sentences). Show you care and ask what's happening. Be specific and avoid generic responses."""

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

CURRENT WELLNESS STATE:
- Today's Mood: {mood if mood else 'Not reported yet'}/10
- Average Mood: {avg_mood if avg_mood else 'Not calculated'}/10
- Stress Level: {stress if stress else 'Not reported yet'}/10
- Sleep Hours: {sleep if sleep else 'Not reported yet'} hours
- Energy Level: {energy if energy else 'Not reported yet'}/10
{f"- Mood Change: {'Improved' if mood_change and mood_change > 0 else 'Declined' if mood_change and mood_change < 0 else 'Stable' if mood_change == 0 else 'Unknown'} ({mood_change:+d} points)" if mood_change is not None else ""}
{voice_insights}"""

            prompt = f"""You are NeuroWell, an AI mental health companion. It's {current_time}. You're smart, empathetic, and ACTUALLY HELPFUL.

{conversation_context}

{user_context}

USER JUST SAID: "{user_message}"

{"🚨 CRISIS INDICATORS: " + ", ".join(crisis_indicators) if crisis_indicators else ""}
{"🎯 DETECTED PROBLEM: " + problem_detected if problem_detected else ""}

CRITICAL: Avoid repeating yourself! If you've already asked about something in the conversation, ask something different or provide new insights.

CONVERSATION STATE: {conversation_state}
- If "asked_whats_wrong" and user is vague, ask about specific feelings or events
- If "asked_how_feeling" and user is vague, ask about what triggered those feelings  
- If "asked_for_details" and user is vague, try a different approach or give practical advice
- If "ongoing", build on what they've shared and ask follow-up questions

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
   - Ask a DIFFERENT specific question based on their data
   - Example: "What's the worst moment you had today?" or "What's one thing that went wrong?"
   - If they keep being vague, try: "What's one small thing that's bothering you right now?"

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

        # STEP 9: Generate response with retry and variation
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Add variation to prevent identical responses
                variation_prompt = prompt + f"\n\nIMPORTANT: Make your response unique and different from previous responses. Current attempt: {attempt + 1}"
                
                response = model.generate_content(variation_prompt)
                bot_response = response.text.strip()
                
                # Check if response is too similar to previous ones
                if conversation_history and len(conversation_history) > 0:
                    last_bot_responses = [msg['content'] for msg in conversation_history if msg['role'] == 'assistant']
                    if last_bot_responses and any(bot_response.lower() in prev.lower() or prev.lower() in bot_response.lower() for prev in last_bot_responses[-2:]):
                        print(f"⚠️ Response too similar to previous, regenerating...")
                        continue
                
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
        
        # Use the fallback system
        return get_fallback_response(user_message, mental_data, voice_data, conversation_history, mode)
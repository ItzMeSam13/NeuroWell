"""
AI-powered counsellor recommendation service based on user wellness data and profile
"""

import google.generativeai as genai
import os
import json
from .counsellors_service import get_all_counsellors, get_specialties

def generate_counsellor_recommendations(user_profile, wellness_data):
    """
    Generate personalized counsellor recommendations using AI based on user profile and wellness data
    """
    try:
        # Ensure Gemini API is configured
        GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-gemini-api-key-here')
        if GEMINI_API_KEY == 'your-gemini-api-key-here' or not GEMINI_API_KEY:
            print("⚠️ WARNING: Gemini API key not set for counsellor recommendations. Using fallback.")
            return _get_fallback_recommendations(user_profile, wellness_data)
        
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            print("✅ Gemini API configured for counsellor recommendations.")
        except Exception as e:
            print(f"❌ Gemini API key invalid for counsellor recommendations: {e}. Using fallback.")
            return _get_fallback_recommendations(user_profile, wellness_data)

        model = genai.GenerativeModel('gemini-1.5-flash')

        # Extract relevant user profile data
        name = user_profile.get('name', 'User')
        age = user_profile.get('age', 'unknown')
        gender = user_profile.get('gender', 'unknown')
        occupation = user_profile.get('occupation', 'unknown')
        mental_issue_details = user_profile.get('mental_issue_details', 'none specified')

        # Extract relevant wellness data
        avg_mood = wellness_data.get('avg_mood', 5)
        avg_stress = wellness_data.get('avg_stress', 5)
        avg_sleep = wellness_data.get('avg_sleep', 7)
        avg_productivity = wellness_data.get('avg_productivity', 5)
        recent_data = wellness_data.get('recent_data', [])

        # Analyze recent trends
        mood_trend = "stable"
        stress_trend = "stable"
        if len(recent_data) >= 2:
            if recent_data[-1].get('mood', 5) > recent_data[-2].get('mood', 5):
                mood_trend = "improving"
            elif recent_data[-1].get('mood', 5) < recent_data[-2].get('mood', 5):
                mood_trend = "declining"
            
            if recent_data[-1].get('stress', 5) < recent_data[-2].get('stress', 5):
                stress_trend = "improving"
            elif recent_data[-1].get('stress', 5) > recent_data[-2].get('stress', 5):
                stress_trend = "declining"

        # Get available counsellors and specialties
        all_counsellors = get_all_counsellors()
        available_specialties = get_specialties()

        prompt = f"""
        You are NeuroWell, an AI assistant specialized in recommending mental health counsellors.
        Your goal is to recommend 3-5 counsellors from the available database based on the user's profile and recent wellness data.

        User Profile:
        - Name: {name}
        - Age: {age}
        - Gender: {gender}
        - Occupation: {occupation}
        - Mental Health History: {mental_issue_details}

        Recent Wellness Data (last 7 days average):
        - Average Mood: {avg_mood}/10 (Trend: {mood_trend})
        - Average Stress: {avg_stress}/10 (Trend: {stress_trend})
        - Average Sleep: {avg_sleep} hours
        - Average Productivity: {avg_productivity}/10

        Available Counsellors Database:
        {json.dumps(all_counsellors, indent=2)}

        Available Specialties:
        {', '.join(available_specialties)}

        Based on this information, recommend 3-5 counsellors that would be most suitable for this user.
        Consider:
        1. Mental health issues mentioned in their profile
        2. Current mood and stress levels
        3. Declining trends that need attention
        4. Age-appropriate care (if specified)
        5. Gender preferences (if relevant)
        6. Specialty match with their needs

        For each recommended counsellor, provide:
        - counsellor_id: The ID from the database
        - match_score: A score from 1-10 indicating how well they match the user's needs
        - reason: A brief explanation of why this counsellor is recommended
        - priority: "High", "Medium", or "Low" based on urgency of need

        Return the recommendations in JSON format:
        {{
            "recommendations": [
                {{
                    "counsellor_id": "counsellor_001",
                    "match_score": 9,
                    "reason": "Specializes in anxiety and depression, which matches your current mood patterns",
                    "priority": "High"
                }}
            ],
            "analysis": "Brief analysis of the user's mental health needs and why these counsellors were selected"
        }}

        Provide only the JSON response. Do not include any other text.
        """

        response = model.generate_content(prompt)
        recommendations_json = response.text.strip()
        
        # Parse the JSON response
        recommendations_data = json.loads(recommendations_json)
        
        if not isinstance(recommendations_data.get('recommendations', []), list):
            raise ValueError("AI response is not in the expected format.")

        print(f"✅ Generated {len(recommendations_data.get('recommendations', []))} counsellor recommendations.")
        return recommendations_data

    except Exception as e:
        print(f"❌ Error generating counsellor recommendations with AI: {e}")
        import traceback
        traceback.print_exc()
        return _get_fallback_recommendations(user_profile, wellness_data)

def _get_fallback_recommendations(user_profile, wellness_data):
    """
    Fallback recommendations when AI is not available
    """
    print("🔄 Using fallback counsellor recommendation system")
    
    all_counsellors = get_all_counsellors()
    recommendations = []
    
    # Extract user data
    mental_issue_details = user_profile.get('mental_issue_details', '').lower()
    avg_mood = wellness_data.get('avg_mood', 5)
    avg_stress = wellness_data.get('avg_stress', 5)
    
    # Simple rule-based matching
    for counsellor in all_counsellors:
        match_score = 5  # Base score
        reason_parts = []
        
        # Check for anxiety/depression
        if avg_mood < 4 or 'anxiety' in mental_issue_details or 'depression' in mental_issue_details:
            if 'anxiety' in counsellor['specialties'] or 'depression' in counsellor['specialties']:
                match_score += 3
                reason_parts.append("specializes in mood disorders")
        
        # Check for stress
        if avg_stress > 7 or 'stress' in mental_issue_details:
            if 'stress-management' in counsellor['specialties']:
                match_score += 2
                reason_parts.append("expert in stress management")
        
        # Check for trauma
        if 'trauma' in mental_issue_details or 'ptsd' in mental_issue_details:
            if 'trauma' in counsellor['specialties'] or 'ptsd' in counsellor['specialties']:
                match_score += 3
                reason_parts.append("trauma specialist")
        
        # Check for relationship issues
        if 'relationship' in mental_issue_details or 'family' in mental_issue_details:
            if 'relationship-counseling' in counsellor['specialties'] or 'family-therapy' in counsellor['specialties']:
                match_score += 2
                reason_parts.append("relationship and family therapy expert")
        
        # Check for addiction
        if 'addiction' in mental_issue_details or 'substance' in mental_issue_details:
            if 'addiction' in counsellor['specialties'] or 'substance-abuse' in counsellor['specialties']:
                match_score += 3
                reason_parts.append("addiction specialist")
        
        # Only include if match score is above threshold
        if match_score >= 6:
            priority = "High" if match_score >= 8 else "Medium" if match_score >= 6 else "Low"
            recommendations.append({
                "counsellor_id": counsellor['id'],
                "match_score": min(match_score, 10),
                "reason": f"Recommended because they {', '.join(reason_parts)}" if reason_parts else "Good general fit for your needs",
                "priority": priority
            })
    
    # Sort by match score and take top 5
    recommendations.sort(key=lambda x: x['match_score'], reverse=True)
    recommendations = recommendations[:5]
    
    # Generate analysis
    analysis = f"Based on your wellness data showing mood at {avg_mood}/10 and stress at {avg_stress}/10, "
    if avg_mood < 4:
        analysis += "you may benefit from mood disorder specialists. "
    if avg_stress > 7:
        analysis += "Stress management experts could help with your high stress levels. "
    analysis += "These counsellors are selected based on your specific needs and current mental health patterns."
    
    return {
        "recommendations": recommendations,
        "analysis": analysis
    }

# app/services/activities_service.py

import random
from datetime import datetime

def generate_personalized_activities(user_profile, wellness_data):
    """
    Generate personalized mental health activities based on user data
    """
    try:
        activities = []
        
        # Extract user data
        age = user_profile.get('age', 25)
        occupation = user_profile.get('occupation', 'Unknown')
        has_mental_issues = user_profile.get('has_mental_issue', False)
        mental_issue_details = user_profile.get('mental_issue_details', '')
        
        # Extract wellness data
        avg_mood = wellness_data.get('avg_mood', 5)
        avg_stress = wellness_data.get('avg_stress', 5)
        avg_sleep = wellness_data.get('avg_sleep', 7)
        avg_productivity = wellness_data.get('avg_productivity', 5)
        
        # Generate activities based on user's current state
        activities.extend(generate_mood_activities(avg_mood, age, has_mental_issues))
        activities.extend(generate_stress_activities(avg_stress, occupation))
        activities.extend(generate_sleep_activities(avg_sleep, age))
        activities.extend(generate_productivity_activities(avg_productivity, occupation))
        activities.extend(generate_general_wellness_activities(age, occupation))
        
        # Add mental health specific activities if user has mental health issues
        if has_mental_issues and mental_issue_details:
            activities.extend(generate_mental_health_activities(mental_issue_details))
        
        # Shuffle and limit to 8-12 activities
        random.shuffle(activities)
        return activities[:12]
        
    except Exception as e:
        print(f"Error generating activities: {e}")
        return get_fallback_activities()

def generate_mood_activities(avg_mood, age, has_mental_issues):
    """Generate mood-boosting activities"""
    activities = []
    
    if avg_mood < 4:
        activities.extend([
            {
                'id': 'mood-gratitude',
                'title': 'Gratitude Journaling',
                'description': 'Write down 3 things you\'re grateful for today. Focus on small moments of joy.',
                'category': 'mindfulness',
                'duration': '10-15 minutes',
                'difficulty': 'Easy',
                'priority': 'High',
                'benefits': ['Improved mood', 'Better perspective', 'Reduced anxiety']
            },
            {
                'id': 'mood-music',
                'title': 'Uplifting Music Session',
                'description': 'Listen to your favorite upbeat songs and sing along or dance.',
                'category': 'mindfulness',
                'duration': '15-20 minutes',
                'difficulty': 'Easy',
                'priority': 'High',
                'benefits': ['Mood boost', 'Stress relief', 'Energy increase']
            }
        ])
    elif avg_mood < 6:
        activities.extend([
            {
                'id': 'mood-nature',
                'title': 'Nature Connection',
                'description': 'Spend time outdoors, even if just sitting by a window with natural light.',
                'category': 'mindfulness',
                'duration': '20-30 minutes',
                'difficulty': 'Easy',
                'priority': 'Medium',
                'benefits': ['Mood improvement', 'Vitamin D', 'Stress reduction']
            }
        ])
    
    return activities

def generate_stress_activities(avg_stress, occupation):
    """Generate stress-relief activities"""
    activities = []
    
    if avg_stress > 7:
        activities.extend([
            {
                'id': 'stress-breathing',
                'title': '4-7-8 Breathing Exercise',
                'description': 'Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 cycles.',
                'category': 'stress-relief',
                'duration': '5-10 minutes',
                'difficulty': 'Easy',
                'priority': 'High',
                'benefits': ['Immediate stress relief', 'Lower heart rate', 'Better focus']
            },
            {
                'id': 'stress-progressive',
                'title': 'Progressive Muscle Relaxation',
                'description': 'Tense and relax each muscle group from head to toe.',
                'category': 'stress-relief',
                'duration': '15-20 minutes',
                'difficulty': 'Medium',
                'priority': 'High',
                'benefits': ['Muscle tension relief', 'Deep relaxation', 'Better sleep']
            }
        ])
    elif avg_stress > 5:
        activities.extend([
            {
                'id': 'stress-mindful',
                'title': 'Mindful Walking',
                'description': 'Take a slow walk while focusing on your breathing and surroundings.',
                'category': 'stress-relief',
                'duration': '10-15 minutes',
                'difficulty': 'Easy',
                'priority': 'Medium',
                'benefits': ['Stress reduction', 'Physical activity', 'Mental clarity']
            }
        ])
    
    # Add work-specific stress relief if occupation suggests high stress
    if occupation.lower() in ['developer', 'engineer', 'manager', 'executive', 'consultant']:
        activities.append({
            'id': 'stress-work',
            'title': 'Work Stress Relief',
            'description': 'Take 5-minute breaks every hour. Practice deep breathing during meetings.',
            'category': 'stress-relief',
            'duration': '5 minutes (hourly)',
            'difficulty': 'Easy',
            'priority': 'Medium',
            'benefits': ['Work stress reduction', 'Better focus', 'Prevented burnout']
        })
    
    return activities

def generate_sleep_activities(avg_sleep, age):
    """Generate sleep improvement activities"""
    activities = []
    
    if avg_sleep < 6:
        activities.extend([
            {
                'id': 'sleep-digital',
                'title': 'Digital Sunset Routine',
                'description': 'Turn off all screens 1 hour before bed. Read or do calming activities.',
                'category': 'sleep',
                'duration': '60 minutes',
                'difficulty': 'Medium',
                'priority': 'High',
                'benefits': ['Better sleep quality', 'Reduced blue light', 'Improved melatonin']
            },
            {
                'id': 'sleep-bedtime',
                'title': 'Consistent Bedtime Routine',
                'description': 'Create a relaxing bedtime routine: warm bath, reading, or gentle stretching.',
                'category': 'sleep',
                'duration': '30-45 minutes',
                'difficulty': 'Easy',
                'priority': 'High',
                'benefits': ['Better sleep onset', 'Improved sleep quality', 'Reduced insomnia']
            }
        ])
    elif avg_sleep < 7:
        activities.append({
            'id': 'sleep-optimization',
            'title': 'Sleep Environment Optimization',
            'description': 'Ensure your bedroom is cool, dark, and quiet. Use blackout curtains if needed.',
            'category': 'sleep',
            'duration': '15 minutes setup',
            'difficulty': 'Easy',
            'priority': 'Medium',
            'benefits': ['Better sleep quality', 'Faster sleep onset', 'Deeper sleep']
        })
    
    return activities

def generate_productivity_activities(avg_productivity, occupation):
    """Generate productivity improvement activities"""
    activities = []
    
    if avg_productivity < 5:
        activities.extend([
            {
                'id': 'productivity-pomodoro',
                'title': 'Pomodoro Technique',
                'description': 'Work in 25-minute focused blocks with 5-minute breaks. Take longer breaks every 4 cycles.',
                'category': 'physical',
                'duration': '25 minutes + breaks',
                'difficulty': 'Easy',
                'priority': 'High',
                'benefits': ['Better focus', 'Reduced burnout', 'Increased productivity']
            },
            {
                'id': 'productivity-morning',
                'title': 'Morning Energy Boost',
                'description': 'Start your day with 10 minutes of light exercise or stretching.',
                'category': 'physical',
                'duration': '10 minutes',
                'difficulty': 'Easy',
                'priority': 'Medium',
                'benefits': ['Increased energy', 'Better mood', 'Improved focus']
            }
        ])
    
    return activities

def generate_general_wellness_activities(age, occupation):
    """Generate general wellness activities"""
    activities = []
    
    # Age-appropriate activities
    if age < 30:
        activities.extend([
            {
                'id': 'wellness-social',
                'title': 'Social Connection',
                'description': 'Reach out to a friend or family member. Social connections boost mental health.',
                'category': 'mindfulness',
                'duration': '15-30 minutes',
                'difficulty': 'Easy',
                'priority': 'Medium',
                'benefits': ['Reduced loneliness', 'Better mood', 'Stronger relationships']
            },
            {
                'id': 'wellness-creative',
                'title': 'Creative Expression',
                'description': 'Engage in a creative activity: drawing, writing, music, or crafts.',
                'category': 'mindfulness',
                'duration': '20-30 minutes',
                'difficulty': 'Easy',
                'priority': 'Low',
                'benefits': ['Stress relief', 'Self-expression', 'Mental stimulation']
            }
        ])
    else:
        activities.extend([
            {
                'id': 'wellness-mindfulness',
                'title': 'Mindfulness Meditation',
                'description': 'Practice 10 minutes of mindfulness meditation using an app or guided session.',
                'category': 'mindfulness',
                'duration': '10 minutes',
                'difficulty': 'Medium',
                'priority': 'Medium',
                'benefits': ['Stress reduction', 'Better focus', 'Emotional regulation']
            }
        ])
    
    return activities

def generate_mental_health_activities(mental_issue_details):
    """Generate activities specific to mental health conditions"""
    activities = []
    
    if 'anxiety' in mental_issue_details.lower():
        activities.append({
            'id': 'anxiety-grounding',
            'title': '5-4-3-2-1 Grounding Technique',
            'description': 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
            'category': 'mindfulness',
            'duration': '5-10 minutes',
            'difficulty': 'Easy',
            'priority': 'High',
            'benefits': ['Anxiety reduction', 'Present moment awareness', 'Panic prevention']
        })
    
    if 'depression' in mental_issue_details.lower():
        activities.append({
            'id': 'depression-activity',
            'title': 'Small Achievement Goal',
            'description': 'Set and complete one small, achievable task today. Celebrate the accomplishment.',
            'category': 'mindfulness',
            'duration': '15-30 minutes',
            'difficulty': 'Easy',
            'priority': 'High',
            'benefits': ['Sense of accomplishment', 'Mood improvement', 'Motivation boost']
        })
    
    return activities

def get_fallback_activities():
    """Fallback activities if AI generation fails"""
    return [
        {
            'id': 'fallback-1',
            'title': 'Deep Breathing Exercise',
            'description': 'Take 5 deep breaths, inhaling for 4 counts and exhaling for 6.',
            'category': 'stress-relief',
            'duration': '5 minutes',
            'difficulty': 'Easy',
            'priority': 'Medium',
            'benefits': ['Stress relief', 'Relaxation', 'Better focus']
        },
        {
            'id': 'fallback-2',
            'title': 'Gratitude Practice',
            'description': 'Write down 3 things you\'re grateful for today.',
            'category': 'mindfulness',
            'duration': '10 minutes',
            'difficulty': 'Easy',
            'priority': 'Medium',
            'benefits': ['Mood improvement', 'Positive mindset', 'Stress reduction']
        },
        {
            'id': 'fallback-3',
            'title': 'Gentle Stretching',
            'description': 'Do 10 minutes of gentle stretching to release tension.',
            'category': 'physical',
            'duration': '10 minutes',
            'difficulty': 'Easy',
            'priority': 'Low',
            'benefits': ['Muscle relaxation', 'Stress relief', 'Better circulation']
        }
    ]

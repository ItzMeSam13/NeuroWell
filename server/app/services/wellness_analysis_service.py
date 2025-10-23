# app/services/wellness_analysis_service.py

import statistics
from datetime import datetime, timedelta

def analyze_weekly_wellness(wellness_data):
    """
    Analyze weekly wellness data and provide comprehensive insights
    """
    try:
        # Filter out null values and get valid data
        valid_data = [day for day in wellness_data if any(day.get(key) is not None for key in ['mood', 'stress', 'sleep', 'productivity'])]
        
        if not valid_data:
            return {
                'overall_score': 0,
                'score_breakdown': {},
                'trends': {},
                'recommendations': ['No data available for analysis']
            }
        
        # Calculate individual metrics
        mood_scores = [day['mood'] for day in valid_data if day.get('mood') is not None]
        stress_scores = [day['stress'] for day in valid_data if day.get('stress') is not None]
        sleep_scores = [day['sleep'] for day in valid_data if day.get('sleep') is not None]
        productivity_scores = [day['productivity'] for day in valid_data if day.get('productivity') is not None]
        
        # Calculate averages
        avg_mood = statistics.mean(mood_scores) if mood_scores else 0
        avg_stress = statistics.mean(stress_scores) if stress_scores else 0
        avg_sleep = statistics.mean(sleep_scores) if sleep_scores else 0
        avg_productivity = statistics.mean(productivity_scores) if productivity_scores else 0
        
        # Calculate individual scores (0-100 scale)
        mood_score = (avg_mood / 10) * 100 if avg_mood > 0 else 0
        stress_score = ((10 - avg_stress) / 10) * 100 if avg_stress > 0 else 0  # Inverted (lower stress = higher score)
        sleep_score = min((avg_sleep / 8) * 100, 100) if avg_sleep > 0 else 0  # 8 hours = 100%
        productivity_score = (avg_productivity / 10) * 100 if avg_productivity > 0 else 0
        
        # Calculate overall score (weighted average)
        weights = {'mood': 0.3, 'stress': 0.25, 'sleep': 0.25, 'productivity': 0.2}
        overall_score = (
            mood_score * weights['mood'] +
            stress_score * weights['stress'] +
            sleep_score * weights['sleep'] +
            productivity_score * weights['productivity']
        )
        
        # Analyze trends
        trends = analyze_trends(valid_data)
        
        # Generate recommendations
        recommendations = generate_recommendations(avg_mood, avg_stress, avg_sleep, avg_productivity, trends)
        
        # Score breakdown
        score_breakdown = {
            'mood': {
                'score': round(mood_score, 1),
                'average': round(avg_mood, 1),
                'status': get_status(mood_score, 'mood')
            },
            'stress': {
                'score': round(stress_score, 1),
                'average': round(avg_stress, 1),
                'status': get_status(stress_score, 'stress')
            },
            'sleep': {
                'score': round(sleep_score, 1),
                'average': round(avg_sleep, 1),
                'status': get_status(sleep_score, 'sleep')
            },
            'productivity': {
                'score': round(productivity_score, 1),
                'average': round(avg_productivity, 1),
                'status': get_status(productivity_score, 'productivity')
            }
        }
        
        return {
            'overall_score': round(overall_score, 1),
            'score_breakdown': score_breakdown,
            'trends': trends,
            'recommendations': recommendations,
            'data_points': len(valid_data),
            'analysis_date': datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error in wellness analysis: {e}")
        return {
            'overall_score': 0,
            'score_breakdown': {},
            'trends': {},
            'recommendations': ['Error analyzing data'],
            'error': str(e)
        }

def analyze_trends(data):
    """
    Analyze trends in the wellness data
    """
    trends = {}
    
    # Mood trend
    mood_values = [day['mood'] for day in data if day.get('mood') is not None]
    if len(mood_values) >= 2:
        mood_trend = 'improving' if mood_values[-1] > mood_values[0] else 'declining' if mood_values[-1] < mood_values[0] else 'stable'
        trends['mood'] = mood_trend
    
    # Stress trend
    stress_values = [day['stress'] for day in data if day.get('stress') is not None]
    if len(stress_values) >= 2:
        stress_trend = 'improving' if stress_values[-1] < stress_values[0] else 'declining' if stress_values[-1] > stress_values[0] else 'stable'
        trends['stress'] = stress_trend
    
    # Sleep trend
    sleep_values = [day['sleep'] for day in data if day.get('sleep') is not None]
    if len(sleep_values) >= 2:
        sleep_trend = 'improving' if sleep_values[-1] > sleep_values[0] else 'declining' if sleep_values[-1] < sleep_values[0] else 'stable'
        trends['sleep'] = sleep_trend
    
    # Productivity trend
    productivity_values = [day['productivity'] for day in data if day.get('productivity') is not None]
    if len(productivity_values) >= 2:
        productivity_trend = 'improving' if productivity_values[-1] > productivity_values[0] else 'declining' if productivity_values[-1] < productivity_values[0] else 'stable'
        trends['productivity'] = productivity_trend
    
    return trends

def get_status(score, metric):
    """
    Get status based on score
    """
    if score >= 80:
        return 'excellent'
    elif score >= 60:
        return 'good'
    elif score >= 40:
        return 'fair'
    else:
        return 'needs_attention'

def generate_recommendations(avg_mood, avg_stress, avg_sleep, avg_productivity, trends):
    """
    Generate personalized recommendations based on wellness data
    """
    recommendations = []
    
    # Mood-based recommendations
    if avg_mood < 5:
        recommendations.append("Your mood has been low. Consider activities that bring you joy, like hobbies or spending time with loved ones.")
    elif avg_mood > 7:
        recommendations.append("Great mood! Keep up the positive activities that are working for you.")
    
    # Stress-based recommendations
    if avg_stress > 7:
        recommendations.append("High stress detected. Try daily meditation, deep breathing exercises, or consider talking to a counselor.")
    elif avg_stress < 4:
        recommendations.append("Excellent stress management! Continue your current stress-reduction techniques.")
    
    # Sleep-based recommendations
    if avg_sleep < 6:
        recommendations.append("Insufficient sleep. Aim for 7-9 hours nightly. Try a consistent bedtime routine and limit screen time before bed.")
    elif avg_sleep > 8:
        recommendations.append("Good sleep habits! Maintain your current sleep schedule for optimal wellness.")
    
    # Productivity-based recommendations
    if avg_productivity < 5:
        recommendations.append("Low productivity. Try breaking tasks into smaller chunks and taking regular breaks to maintain focus.")
    elif avg_productivity > 7:
        recommendations.append("High productivity! Keep up your effective work strategies.")
    
    # Trend-based recommendations
    if trends.get('mood') == 'declining':
        recommendations.append("Mood trend is declining. Consider reaching out for support or trying new mood-boosting activities.")
    
    if trends.get('stress') == 'declining':
        recommendations.append("Stress levels are increasing. Prioritize stress management techniques and consider professional help if needed.")
    
    if not recommendations:
        recommendations.append("Your wellness metrics look balanced. Continue maintaining your current healthy habits!")
    
    return recommendations

# app/routes.py
from flask import Blueprint, request, jsonify
from app.services.gemini_service import generate_gemini_response
from app.services.voice_analysis_service import voice_analyzer
from app.services.wellness_analysis_service import analyze_weekly_wellness
from app.services.activities_service import generate_personalized_activities
from app.services.counsellors_service import get_all_counsellors, get_counsellors_by_specialty, search_counsellors_by_name, get_specialties
from app.services.counsellor_recommendation_service import generate_counsellor_recommendations

routes = Blueprint('routes', __name__)


@routes.route('/api/analyze-voice', methods=['POST'])
def analyze_voice():
    """
    NEW FEATURE: Analyzes voice AND transcribes speech to text
    Returns: {emotions, transcribed_text}
    
    Frontend can use transcribed_text as the message automatically!
    """
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
        
        # Read audio bytes
        audio_bytes = audio_file.read()
        
        print(f"📁 Received audio file: {len(audio_bytes)} bytes")
        
        # Analyze voice AND transcribe to text (both happen here!)
        result = voice_analyzer.analyze_audio(audio_bytes)
        
        # Return emotions + transcribed text
        return jsonify({
            'transcribed_text': result['transcribed_text'],  # Speech-to-text!
            'emotions': {
                'stressed': result['stressed'],
                'frustrated': result['frustrated'],
                'anxious': result['anxious'],
                'angry': result['angry'],
                'tired': result['tired'],
                'sad': result['sad'],
                'tone': result['tone'],
                'pitch': result['pitch'],
                'pace': result['pace'],
                'energy': result['energy'],
                'confidence': result['confidence'],
                'detected_emotion': result['detected_emotion'],
                'language_pattern': result['language_pattern']
            },
            'success': True
        }), 200
        
    except Exception as e:
        print(f"❌ Voice API error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': str(e),
            'success': False
        }), 500


@routes.route('/api/chat', methods=['POST'])
def chat():
    """
    Main chat endpoint
    Now accepts voice_analysis which includes transcribed text!
    """
    try:
        data = request.get_json()
        
        mode = data.get('mode', 'chat')
        user_message = data.get('message', '')
        test_data = data.get('test_data', {})
        conversation_history = data.get('conversation_history', [])
        voice_analysis = data.get('voice_analysis')
        
        # NEW: If voice analysis has transcribed text, use it as message
        if voice_analysis and voice_analysis.get('transcribed_text'):
            user_message = voice_analysis['transcribed_text']
            print(f"Using transcribed speech as message: '{user_message}'")
        
        print(f"Chat request: mode={mode}, message='{user_message[:50] if user_message else 'N/A'}'")
        print(f"Conversation history length: {len(conversation_history)}")
        if voice_analysis:
            print(f"Voice emotions: stressed={voice_analysis.get('stressed', 'N/A')}, anxious={voice_analysis.get('anxious', 'N/A')}")
        
        # Debug conversation flow
        if conversation_history:
            print("Recent conversation:")
            for i, msg in enumerate(conversation_history[-3:]):
                role = "Bot" if msg['role'] == 'assistant' else "User"
                print(f"  {i+1}. {role}: {msg['content'][:50]}...")
        
        # Validate message
        if mode == 'chat' and not user_message:
            return jsonify({'error': 'Message or voice recording is required'}), 400
        
        # Generate response with Gemini (gets text + voice emotions)
        bot_response = generate_gemini_response(
            user_message,
            test_data,
            voice_analysis,
            conversation_history,
            mode
        )
        
        return jsonify({
            'bot_response': bot_response,
            'user_message': user_message,  # Return what was understood
            'status': 'success'
        }), 200
        
    except Exception as e:
        print(f"Chat API error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@routes.route('/api/wellness-analysis', methods=['POST'])
def wellness_analysis():
    """
    Analyze weekly wellness data and provide overall score
    """
    try:
        data = request.get_json()
        wellness_data = data.get('wellness_data', [])
        user_id = data.get('user_id')
        
        if not wellness_data:
            return jsonify({'error': 'No wellness data provided'}), 400
        
        # Calculate overall wellness score
        analysis_result = analyze_weekly_wellness(wellness_data)
        
        return jsonify({
            'overall_score': analysis_result['overall_score'],
            'score_breakdown': analysis_result['score_breakdown'],
            'trends': analysis_result['trends'],
            'recommendations': analysis_result['recommendations'],
            'status': 'success'
        }), 200
        
    except Exception as e:
        print(f"Wellness analysis error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@routes.route('/api/activities', methods=['POST'])
def get_personalized_activities():
    """
    Generate personalized mental health activities based on user data
    """
    try:
        data = request.get_json()
        user_profile = data.get('user_profile', {})
        wellness_data = data.get('wellness_data', {})
        
        print(f"Activities request: user_id={user_profile.get('user_id', 'unknown')}")
        print(f"Wellness data: mood={wellness_data.get('avg_mood', 'N/A')}, stress={wellness_data.get('avg_stress', 'N/A')}")
        
        # Generate personalized activities using AI
        activities = generate_personalized_activities(user_profile, wellness_data)
        
        return jsonify({
            'activities': activities,
            'status': 'success',
            'total_activities': len(activities)
        }), 200
        
    except Exception as e:
        print(f"Activities API error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@routes.route('/api/counsellors', methods=['GET'])
def get_counsellors():
    """
    Get all counsellors with optional filtering (now uses Firebase data from frontend)
    Note: This endpoint is kept for backward compatibility but frontend now fetches directly from Firebase
    """
    try:
        specialty = request.args.get('specialty', 'all')
        search = request.args.get('search', '')
        
        counsellors = get_all_counsellors()
        
        # Apply specialty filter
        if specialty and specialty.lower() != 'all':
            counsellors = get_counsellors_by_specialty(specialty)
        
        # Apply search filter
        if search:
            counsellors = search_counsellors_by_name(search)
        
        return jsonify({
            'counsellors': counsellors,
            'total': len(counsellors),
            'status': 'success',
            'note': 'Frontend now fetches directly from Firebase. This endpoint is for backward compatibility.'
        }), 200
        
    except Exception as e:
        print(f"Counsellors API error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@routes.route('/api/counsellors/specialties', methods=['GET'])
def get_counsellor_specialties():
    """
    Get all available counsellor specialties (now uses Firebase data from frontend)
    Note: This endpoint is kept for backward compatibility but frontend now fetches directly from Firebase
    """
    try:
        specialties = get_specialties()
        return jsonify({
            'specialties': specialties,
            'status': 'success',
            'note': 'Frontend now fetches directly from Firebase. This endpoint is for backward compatibility.'
        }), 200
        
    except Exception as e:
        print(f"Specialties API error: {e}")
        return jsonify({'error': str(e)}), 500


@routes.route('/api/counsellors/recommendations', methods=['POST'])
def get_counsellor_recommendations():
    """
    Get AI-powered counsellor recommendations based on user data
    """
    try:
        data = request.get_json()
        user_profile = data.get('user_profile', {})
        wellness_data = data.get('wellness_data', {})
        
        print(f"Counsellor recommendations request: user_id={user_profile.get('user_id', 'unknown')}")
        
        # Generate AI recommendations
        recommendations_data = generate_counsellor_recommendations(user_profile, wellness_data)
        
        # Get full counsellor details for recommended counsellors
        all_counsellors = get_all_counsellors()
        counsellor_map = {c['id']: c for c in all_counsellors}
        
        # Enhance recommendations with full counsellor data
        enhanced_recommendations = []
        for rec in recommendations_data.get('recommendations', []):
            counsellor_id = rec['counsellor_id']
            if counsellor_id in counsellor_map:
                counsellor_data = counsellor_map[counsellor_id].copy()
                counsellor_data['match_score'] = rec['match_score']
                counsellor_data['reason'] = rec['reason']
                counsellor_data['priority'] = rec['priority']
                enhanced_recommendations.append(counsellor_data)
        
        return jsonify({
            'recommendations': enhanced_recommendations,
            'analysis': recommendations_data.get('analysis', ''),
            'status': 'success'
        }), 200
        
    except Exception as e:
        print(f"Counsellor recommendations API error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@routes.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy', 
        'voice_model': 'loaded',
        'speech_to_text': 'ready',
        'gemini': 'ready',
        'features': [
            'text_chat', 
            'voice_emotion_analysis', 
            'speech_to_text',  # NEW!
            'proactive_support',
            'wellness_analysis',  # NEW!
            'personalized_activities',  # NEW!
            'counsellor_recommendations'  # NEW!
        ]
    }), 200
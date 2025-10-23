# app/routes.py
from flask import Blueprint, request, jsonify
from app.services.gemini_service import generate_gemini_response
from app.services.voice_analysis_service import voice_analyzer
from app.services.firebase_service import get_user_data

routes = Blueprint('routes', _name_)


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
        if voice_analysis:
            print(f"Voice emotions: stressed={voice_analysis.get('stressed', 'N/A')}, anxious={voice_analysis.get('anxious', 'N/A')}")
        
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
            'proactive_support'
        ]
    }), 200
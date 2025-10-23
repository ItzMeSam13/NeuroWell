# app/services/voice_analysis_service.py

import torch
import librosa
import numpy as np
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification
import io
import speech_recognition as sr
from pydub import AudioSegment
import tempfile
import os
import warnings
warnings.filterwarnings('ignore')


class VoiceEmotionAnalyzer:
    def _init_(self):
        """
        Load emotion detection model + speech recognition
        """
        model_name = "superb/hubert-large-superb-er"
        
        print("Loading voice emotion AI model...")
        self.feature_extractor = AutoFeatureExtractor.from_pretrained(model_name)
        self.model = AutoModelForAudioClassification.from_pretrained(model_name)
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)
        self.model.eval()
        
        # Initialize speech recognizer (FREE)
        self.recognizer = sr.Recognizer()
        
        self.emotion_labels = ['neu', 'hap', 'ang', 'sad']
        print(f"Voice AI loaded successfully on {self.device}")
        print(f"Speech-to-Text ready (Google Free API)")
    
    def convert_audio_format(self, audio_bytes):
        """
        Convert any audio format to WAV for processing
        Fixes the 'Format not recognised' error
        """
        try:
            # Save bytes to temp file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_input:
                temp_input.write(audio_bytes)
                temp_input_path = temp_input.name
            
            # Convert to WAV using pydub (supports webm, ogg, mp3, etc.)
            audio = AudioSegment.from_file(temp_input_path)
            
            # Export as WAV
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_output:
                temp_output_path = temp_output.name
            
            audio.export(temp_output_path, format='wav')
            
            # Clean up input temp file
            os.unlink(temp_input_path)
            
            return temp_output_path
            
        except Exception as e:
            print(f"Audio conversion error: {e}")
            raise
    
    def transcribe_speech(self, audio_bytes):
        """
        Convert speech to text using FREE Google Speech Recognition
        """
        try:
            # Convert audio to WAV format first
            wav_path = self.convert_audio_format(audio_bytes)
            
            # Load audio file for speech recognition
            with sr.AudioFile(wav_path) as source:
                audio_data = self.recognizer.record(source)
            
            # Use FREE Google Speech Recognition
            text = self.recognizer.recognize_google(audio_data)
            
            # Clean up temp file
            os.unlink(wav_path)
            
            print(f"📝 Transcribed: '{text}'")
            return text
            
        except sr.UnknownValueError:
            print("Could not understand audio")
            return ""
        except sr.RequestError as e:
            print(f"Speech recognition error: {e}")
            return ""
        except Exception as e:
            print(f"Transcription error: {e}")
            return ""
    
    def analyze_audio(self, audio_bytes):
        """
        Analyze voice emotions + transcribe speech to text
        Returns: {emotions, transcribed_text}
        """
        try:
            # Step 1: Transcribe speech to text (FREE)
            transcribed_text = self.transcribe_speech(audio_bytes)
            
            # Step 2: Convert audio for emotion analysis
            wav_path = self.convert_audio_format(audio_bytes)
            
            # Load audio with librosa (now it's in WAV format)
            waveform, sr = librosa.load(wav_path, sr=16000, mono=True)
            
            # Clean up temp file
            os.unlink(wav_path)
            
            # Extract acoustic features
            energy = float(np.sqrt(np.mean(waveform ** 2)))
            zcr = float(np.mean(librosa.feature.zero_crossing_rate(waveform)[0]))
            
            try:
                spectral_centroid = float(np.mean(librosa.feature.spectral_centroid(y=waveform, sr=16000)[0]))
            except:
                spectral_centroid = 2000
            
            # Get emotion predictions from model
            inputs = self.feature_extractor(waveform, sampling_rate=16000, return_tensors="pt", padding=True)
            
            if hasattr(inputs, 'input_values'):
                inputs['input_values'] = inputs['input_values'].to(self.device)
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probs = torch.nn.functional.softmax(logits, dim=-1)[0].cpu()
            
            # Get emotion scores
            emotion_dict = {}
            for i, label in enumerate(self.emotion_labels):
                emotion_dict[label] = float(probs[i] * 100)
            
            neutral_score = emotion_dict.get('neu', 0)
            happy_score = emotion_dict.get('hap', 0)
            angry_score = emotion_dict.get('ang', 0)
            sad_score = emotion_dict.get('sad', 0)
            
            # Calculate mental health metrics
            stressed = min(100, angry_score * 0.7 + (100 - happy_score) * 0.3 + zcr * 300)
            frustrated = min(100, angry_score * 0.85 + zcr * 200)
            anxious = min(100, (100 - neutral_score) * 0.6 + zcr * 250)
            angry = angry_score
            tired = min(100, sad_score * 0.5 + (100 - energy * 100))
            sad = sad_score
            
            # Voice characteristics
            if stressed > 60:
                tone = 'tense'
            elif neutral_score > 50:
                tone = 'calm'
            elif zcr > 0.15:
                tone = 'hurried'
            else:
                tone = 'monotone'
            
            pitch = 'high' if spectral_centroid > 3000 else 'low' if spectral_centroid < 1500 else 'normal'
            pace = 'fast' if zcr > 0.15 else 'slow' if zcr < 0.08 else 'normal'
            energy_level = 'high' if energy > 0.5 else 'low' if energy < 0.2 else 'medium'
            
            primary_emotion = max(emotion_dict, key=emotion_dict.get)
            emotion_names = {'neu': 'neutral', 'hap': 'happy', 'ang': 'angry', 'sad': 'sad'}
            primary_emotion_name = emotion_names.get(primary_emotion, 'neutral')
            
            confidence = max(probs) * 100
            
            result = {
                'transcribed_text': transcribed_text,  # NEW: Speech-to-text
                'stressed': round(stressed, 1),
                'frustrated': round(frustrated, 1),
                'anxious': round(anxious, 1),
                'angry': round(angry, 1),
                'tired': round(tired, 1),
                'sad': round(sad, 1),
                'tone': tone,
                'pitch': pitch,
                'pace': pace,
                'energy': energy_level,
                'confidence': round(float(confidence), 1),
                'detected_emotion': primary_emotion_name,
                'language_pattern': f'{pace} speech with {tone} tone'
            }
            
            print(f"Voice analyzed: {primary_emotion_name} ({confidence:.1f}% confidence)")
            print(f"   Transcribed: '{transcribed_text}'")
            print(f"   Stressed: {stressed:.1f}, Anxious: {anxious:.1f}")
            return result
            
        except Exception as e:
            print(f"Voice analysis error: {e}")
            import traceback
            traceback.print_exc()
            
            # Still try to transcribe even if emotion analysis fails
            try:
                transcribed_text = self.transcribe_speech(audio_bytes)
            except:
                transcribed_text = ""
            
            return {
                'transcribed_text': transcribed_text,
                'stressed': 50, 'frustrated': 40, 'anxious': 45,
                'angry': 20, 'tired': 50, 'sad': 40,
                'tone': 'normal', 'pitch': 'normal', 'pace': 'normal',
                'energy': 'medium', 'confidence': 60,
                'detected_emotion': 'neutral', 'language_pattern': 'normal speech'
            }


# Initialize voice analyzer globally
print("=" * 50)
print("Initializing Voice Analyzer with Speech-to-Text")
print("=" * 50)
voice_analyzer = VoiceEmotionAnalyzer()
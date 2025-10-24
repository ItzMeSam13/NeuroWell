# NeuroWell - AI-Powered Mental Health Companion

## 🧠 Project Title

**NeuroWell** - An intelligent mental health platform that combines AI-powered voice analysis, personalized wellness tracking, and professional counselor recommendations to support users' mental health journey.

## 👥 Team Members

- **Member 1**: Sampreet Kalkundrikar
- **Member 2**: Prathamesh Naik
- **Member 3**: Gangavarapu Kaarthikeya

## 🎯 Problem Statement 3

Mental health support is often inaccessible, expensive, or lacks personalization. Many individuals struggle with:

- **Limited access** to mental health professionals
- **High costs** of therapy and counseling services
- **Lack of personalized** mental health recommendations
- **Difficulty tracking** wellness patterns over time
- **Stigma** around seeking mental health support

NeuroWell addresses these challenges by providing:

- **24/7 AI companion** for immediate emotional support
- **Voice emotion analysis** to detect stress, anxiety, and mood patterns
- **Personalized wellness tracking** with data-driven insights
- **Professional counselor matching** based on individual needs
- **Accessible and affordable** mental health support

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16.0.0 with React 19.2.0
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore

### Backend

- **Framework**: Flask 3.1.2 (Python)
- **AI/ML Libraries**:
  - Google Generative AI (Gemini)
  - Transformers (Hugging Face)
  - PyTorch 2.9.0
  - Scikit-learn 1.7.2
  - Librosa (audio processing)
  - SpeechRecognition
- **Audio Processing**: Pydub, SoundFile
- **API**: RESTful API with Flask-CORS
- **Deployment**: Python virtual environment

### AI/ML Features

- **Voice Emotion Analysis**: Real-time emotion detection from speech
- **Speech-to-Text**: Automatic transcription of voice messages
- **Natural Language Processing**: Google Gemini for intelligent conversations
- **Wellness Analysis**: ML-powered mood and stress pattern recognition
- **Personalized Recommendations**: AI-driven activity and counselor suggestions

## 🚀 How to Run the Project

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Firebase Account** (for authentication and database)
- **Google AI API Key** (for Gemini integration)

### Backend Setup

1. **Navigate to server directory**:

   ```bash
   cd server
   ```

2. **Create and activate virtual environment**:

   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:

   ```bash
   # Create .env file in server directory
   GOOGLE_API_KEY=your_google_ai_api_key_here
   FLASK_ENV=development
   ```

5. **Run the Flask server**:
   ```bash
   python run.py
   ```
   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**:

   ```bash
   cd client
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Firebase configuration**:

   - Create a Firebase project
   - Enable Authentication and Firestore
   - Copy your Firebase config to `client/src/Firebase/config.js`

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

### Complete Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd NeuroWell
   ```

2. **Set up both frontend and backend** (follow steps above)

3. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 📱 Features

### 🤖 AI Companion

- **Intelligent Chat**: Context-aware conversations powered by Google Gemini
- **Voice Interaction**: Speak naturally with emotion detection
- **Proactive Support**: AI initiates conversations based on wellness patterns
- **Text-to-Speech**: Audio responses for accessibility

### 📊 Wellness Tracking

- **Daily Check-ins**: Mood, stress, sleep, and energy tracking
- **Visual Analytics**: Interactive graphs showing wellness trends
- **Wellness Score**: Comprehensive mental health scoring system
- **Pattern Recognition**: AI identifies concerning trends

### 🎯 Personalized Activities

- **AI-Generated Recommendations**: Activities tailored to individual needs
- **Mood-Based Suggestions**: Activities matched to current emotional state
- **Progress Tracking**: Monitor activity completion and effectiveness

### 👨‍⚕️ Professional Support

- **Counselor Database**: Comprehensive directory of mental health professionals
- **AI Matching**: Intelligent counselor recommendations based on user profile
- **Specialty Filtering**: Find counselors by specific mental health areas
- **Direct Contact**: Easy access to professional support

### 🎤 Voice Analysis

- **Emotion Detection**: Real-time analysis of stress, anxiety, frustration
- **Speech Patterns**: Analysis of tone, pace, and confidence levels
- **Automatic Transcription**: Convert speech to text for processing
- **Emotional Insights**: Detailed breakdown of detected emotions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email [your-email@example.com] or create an issue in the repository.

---

**NeuroWell** - Empowering mental health through AI technology 🧠✨

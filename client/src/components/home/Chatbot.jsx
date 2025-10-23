"use client";

import React, { useState, useEffect, useRef } from "react";
import {
	Send,
	Mic,
	MicOff,
	Activity,
	Moon,
	Brain,
	AlertCircle,
} from "lucide-react";

export default function Chatbot() {
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [isListening, setIsListening] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [conversationHistory, setConversationHistory] = useState([]);
	const [voiceEmotion, setVoiceEmotion] = useState(null);
	const [recordingStatus, setRecordingStatus] = useState("");
	const messagesEndRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const synthRef = useRef(null);

	const API_URL = "http://localhost:5000/api/chat";
	const VOICE_API_URL = "http://localhost:5000/api/analyze-voice";

	const testData = {
		mental_health: {
			mood_yesterday: 7,
			mood_today: 4,
			mood: 4,
			stress: 8,
			sleep_hours: 5,
			energy: 3,
		},
		phone_wellbeing: {
			screen_time_minutes: 180,
			screen_time_last_night: 120,
			unlocks: 92,
			notifications: 2607,
			apps: {
				Instagram: 60,
				WhatsApp: 30,
				YouTube: 30,
			},
		},
	};

	// Initialize text-to-speech
	useEffect(() => {
		if (typeof window !== "undefined") {
			synthRef.current = window.speechSynthesis;
		}
	}, []);

	const speakText = (text) => {
		if (!synthRef.current) return;
		synthRef.current.cancel();
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = 0.9;
		utterance.pitch = 1;
		utterance.volume = 1;
		const voices = synthRef.current.getVoices();
		const preferredVoice = voices.find(
			(voice) =>
				voice.name.includes("Google") ||
				voice.name.includes("Microsoft") ||
				voice.lang.includes("en")
		);
		if (preferredVoice) utterance.voice = preferredVoice;
		synthRef.current.speak(utterance);
	};

	// Bot asks first question
	useEffect(() => {
		const initiateChat = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(API_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						mode: "proactive",
						test_data: testData,
						conversation_history: [],
					}),
				});

				if (!response.ok) throw new Error("Backend not connected");

				const data = await response.json();
				const botMessage = { text: data.bot_response, sender: "bot" };
				setMessages([botMessage]);
				setConversationHistory([
					{ role: "assistant", content: data.bot_response },
				]);
				setIsConnected(true);
				speakText(data.bot_response);
			} catch (error) {
				console.error("Connection error:", error);
				const fallbackMsg =
					"Hey, I noticed your mood dropped from 7 to 4 and you're stressed at 8/10. What's going on?";
				setMessages([{ text: fallbackMsg, sender: "bot" }]);
				setConversationHistory([{ role: "assistant", content: fallbackMsg }]);
				setIsConnected(false);
				speakText(fallbackMsg);
			} finally {
				setIsLoading(false);
			}
		};
		initiateChat();
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Analyze voice and auto-send message
	const analyzeVoiceAndSend = async (audioBlob, transcript) => {
		try {
			setRecordingStatus("Analyzing voice...");

			const formData = new FormData();
			formData.append("audio", audioBlob, "voice.webm");

			const response = await fetch(VOICE_API_URL, {
				method: "POST",
				body: formData,
			});

			let emotionData = null;
			if (response.ok) {
				emotionData = await response.json();
				console.log("Voice emotion detected:", emotionData);

				if (
					emotionData.transcribed_text &&
					emotionData.transcribed_text.trim()
				) {
					transcript = emotionData.transcribed_text;
					console.log("Using backend transcription:", transcript);
				}
			}

			setRecordingStatus("");

			if (transcript && transcript.trim()) {
				await sendMessageWithEmotion(transcript, emotionData);
			} else {
				alert(
					"Could not understand speech. Please try again or type your message."
				);
			}
		} catch (error) {
			console.error("Voice analysis error:", error);
			setRecordingStatus("");
			if (transcript && transcript.trim()) {
				await sendMessageWithEmotion(transcript, null);
			} else {
				alert("Voice recording failed. Please try again.");
			}
		}
	};

	// Start recording
	const startRecording = async () => {
		try {
			setRecordingStatus("Recording...");
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);
			audioChunksRef.current = [];

			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorderRef.current.onstop = async () => {
				const audioBlob = new Blob(audioChunksRef.current, {
					type: "audio/webm",
				});
				stream.getTracks().forEach((track) => track.stop());
				const transcript = await getBrowserTranscript(audioBlob);
				await analyzeVoiceAndSend(audioBlob, transcript);
			};

			mediaRecorderRef.current.start();
			setIsListening(true);
		} catch (error) {
			console.error("Recording error:", error);
			alert("Microphone access denied. Please enable microphone permissions.");
			setRecordingStatus("");
		}
	};

	// Get transcript
	const getBrowserTranscript = (audioBlob) => {
		return new Promise((resolve) => {
			const SpeechRecognition =
				window.SpeechRecognition || window.webkitSpeechRecognition;
			if (!SpeechRecognition) {
				console.log("Browser speech recognition not supported");
				resolve("");
				return;
			}

			const recognition = new SpeechRecognition();
			recognition.continuous = false;
			recognition.interimResults = false;
			recognition.lang = "en-US";

			recognition.onresult = (event) => {
				const transcript = event.results[0][0].transcript;
				console.log("Browser transcript:", transcript);
				resolve(transcript);
			};

			recognition.onerror = (event) => {
				console.error("Speech recognition error:", event.error);
				resolve("");
			};

			recognition.onend = () => {
				console.log("Speech recognition ended");
			};

			try {
				const audioUrl = URL.createObjectURL(audioBlob);
				const audio = new Audio(audioUrl);

				recognition.start();
				audio.play();

				setTimeout(() => {
					recognition.stop();
					resolve("");
				}, 5000);
			} catch (err) {
				console.error("Recognition start error:", err);
				resolve("");
			}
		});
	};

	const stopRecording = () => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === "recording"
		) {
			mediaRecorderRef.current.stop();
			setIsListening(false);
		}
	};

	// Send message with emotion
	const sendMessageWithEmotion = async (messageText, emotionData) => {
		if (!messageText.trim() || isLoading) return;

		const userMsg = { text: messageText, sender: "user" };
		setMessages((prev) => [...prev, userMsg]);

		const updatedHistory = [
			...conversationHistory,
			{ role: "user", content: messageText },
		];

		setIsLoading(true);
		setVoiceEmotion(emotionData);

		try {
			const response = await fetch(API_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: messageText,
					mode: "chat",
					test_data: testData,
					conversation_history: updatedHistory,
					voice_analysis: emotionData,
				}),
			});

			if (!response.ok) throw new Error("Backend error");

			const data = await response.json();
			const botMsg = { text: data.bot_response, sender: "bot" };
			setMessages((prev) => [...prev, botMsg]);

			setConversationHistory([
				...updatedHistory,
				{ role: "assistant", content: data.bot_response },
			]);

			setIsConnected(true);
			speakText(data.bot_response);
			setVoiceEmotion(null);
		} catch (error) {
			console.error("API Error:", error);
			const errorMsg = {
				text: "I'm having trouble connecting. Please try again.",
				sender: "bot",
				error: true,
			};
			setMessages((prev) => [...prev, errorMsg]);
			setIsConnected(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSend = async () => {
		if (!inputMessage.trim() || isLoading) return;
		const messageText = inputMessage;
		setInputMessage("");
		await sendMessageWithEmotion(messageText, null);
	};

	const toggleVoice = () => {
		if (isListening) stopRecording();
		else startRecording();
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4'>
			<div
				className='w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col'
				style={{ height: "85vh" }}>
				{/* Header */}
				<div className='bg-[#06b6d4] px-6 py-4 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='bg-white/20 p-2 rounded-full'>
							<Brain className='w-6 h-6 text-white' />
						</div>
						<div>
							<h1 className='text-white text-xl font-semibold'>
								NeuroWell Companion
							</h1>
							<div className='flex items-center gap-2'>
								<div
									className={`w-2 h-2 rounded-full ${
										isConnected ? "bg-green-300" : "bg-yellow-300"
									}`}></div>
								<p className='text-white/80 text-xs'>
									{isConnected ? "AI Connected" : "Offline Mode"}
								</p>
							</div>
						</div>
					</div>

					<div className='hidden md:flex gap-4'>
						<div className='bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2'>
							<Activity className='w-4 h-4 text-white/80' />
							<div className='text-left'>
								<p className='text-white/60 text-xs'>Mood</p>
								<p className='text-white font-semibold text-sm'>
									{testData.mental_health.mood}/10
								</p>
							</div>
						</div>
						<div className='bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2'>
							<Moon className='w-4 h-4 text-white/80' />
							<div className='text-left'>
								<p className='text-white/60 text-xs'>Sleep</p>
								<p className='text-white font-semibold text-sm'>
									{testData.mental_health.sleep_hours}h
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Voice Emotion Indicator */}
				{voiceEmotion && (
					<div className='bg-amber-50 border-b border-amber-200 px-4 py-2'>
						<p className='text-xs text-amber-800'>
							🎤 Voice detected:
							{voiceEmotion.stressed > 60 && " 😰 Stressed"}
							{voiceEmotion.frustrated > 60 && " 😤 Frustrated"}
							{voiceEmotion.anxious > 60 && " 😟 Anxious"}
							{voiceEmotion.angry > 60 && " 😠 Angry"}
							{voiceEmotion.tired > 70 && " 😴 Tired"}
							{voiceEmotion.sad > 70 && " 😢 Sad"} - Speaking{" "}
							{voiceEmotion.pace} with {voiceEmotion.tone} tone
						</p>
					</div>
				)}

				{/* Recording Status */}
				{recordingStatus && (
					<div className='bg-blue-50 border-b border-blue-200 px-4 py-2'>
						<p className='text-xs text-blue-800 flex items-center gap-2'>
							<AlertCircle className='w-3 h-3' />
							{recordingStatus}
						</p>
					</div>
				)}

				{/* Messages */}
				<div className='flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50'>
					{messages.map((message, index) => (
						<div
							key={index}
							className={`flex ${
								message.sender === "user" ? "justify-end" : "justify-start"
							}`}>
							{message.sender === "bot" && (
								<div className='w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3 flex-shrink-0'>
									<Brain className='w-4 h-4 text-white' />
								</div>
							)}
							<div
								className={`max-w-[75%] rounded-2xl px-4 py-3 ${
									message.sender === "user"
										? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
										: message.error
										? "bg-red-50 text-red-700 border border-red-200"
										: "bg-white text-gray-800 shadow-md border border-gray-100"
								}`}>
								<p className='text-sm leading-relaxed'>{message.text}</p>
							</div>
							{message.sender === "user" && (
								<div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center ml-3 flex-shrink-0 text-white font-semibold text-xs'>
									You
								</div>
							)}
						</div>
					))}

					{isLoading && (
						<div className='flex justify-start'>
							<div className='w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3'>
								<Brain className='w-4 h-4 text-white' />
							</div>
							<div className='bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100'>
								<div className='flex gap-1'>
									<div
										className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce'
										style={{ animationDelay: "0ms" }}></div>
									<div
										className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce'
										style={{ animationDelay: "150ms" }}></div>
									<div
										className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce'
										style={{ animationDelay: "300ms" }}></div>
								</div>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input Bar */}
				<div className='bg-white border-t border-gray-200 p-4'>
					<div className='flex gap-3 items-center'>
						<button
							onClick={toggleVoice}
							disabled={isLoading}
							className={`p-3 rounded-xl transition-all ${
								isListening
									? "bg-red-500 text-white shadow-lg animate-pulse"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							} disabled:opacity-50`}>
							{isListening ? (
								<MicOff className='w-5 h-5' />
							) : (
								<Mic className='w-5 h-5' />
							)}
						</button>

						<input
							type='text'
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder={
								isListening ? "Listening..." : "Type or speak your message..."
							}
							disabled={isLoading || isListening}
							className='flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all'
						/>

						<button
							onClick={handleSend}
							disabled={!inputMessage.trim() || isLoading}
							className='bg-[#06b6d4] text-white p-3 rounded-xl hover:bg-[#0891b2] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'>
							<Send className='w-5 h-5' />
						</button>
					</div>

					{isListening && (
						<p className='text-xs text-gray-500 mt-2 text-center animate-pulse'>
							🎤 Recording... Click stop when done speaking
						</p>
					)}
				</div>
			</div>
		</div>
	);
}


import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, encode, decodeAudioData } from '../utils/audioUtils';
import { UserProfile, DailyLogEntry } from '../types';

interface VoiceAssistantProps {
  profile: UserProfile;
  logs: DailyLogEntry[];
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ profile, logs }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to chat');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const toggleSession = async () => {
    if (isActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recentContext = logs.slice(-3).map(l => 
        `User ate ${l.food}, drank ${l.water}L water, and did ${l.exercise}.`
      ).join(' ');

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('Listening...');
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live Error:', e);
            setStatus('Error occurred');
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Session closed');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: `You are an energetic and empathetic health coach for Health Monetisation. 
            The user is ${profile.age} years old and identifies as ${profile.gender}. 
            Their main health focus is ${profile.specialization}. 
            Recent activity history: ${recentContext || 'No logs yet'}.
            Talk to them naturally about their day, provide motivation, and answer health questions briefly. Be encouraging!`,
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Could not start microphone');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setStatus('Stopped');
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden h-full flex flex-col items-center justify-center">
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">Voice Coach Live</h2>
        <p className="text-indigo-100 text-sm mb-8 text-center max-w-sm">
          Speak with your personal AI assistant. Gemini knows your profile and recent logs.
        </p>

        <button
          onClick={toggleSession}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
            isActive ? 'bg-red-500 scale-110' : 'bg-white text-indigo-600 hover:scale-105'
          }`}
        >
          {isActive ? (
            <div className="flex gap-1 items-center">
              <div className="w-1.5 h-6 bg-white animate-bounce"></div>
              <div className="w-1.5 h-10 bg-white animate-bounce [animation-delay:-0.2s]"></div>
              <div className="w-1.5 h-6 bg-white animate-bounce [animation-delay:-0.4s]"></div>
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
        
        <p className="mt-6 font-medium text-indigo-100">{status}</p>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400 opacity-10 rounded-full -ml-10 -mb-10"></div>
    </div>
  );
};

export default VoiceAssistant;

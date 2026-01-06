
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { UserProfile, DailyLogEntry } from '../types';

interface HealthCoachProps {
  profile: UserProfile;
  logs: DailyLogEntry[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const HealthCoach: React.FC<HealthCoachProps> = ({ profile, logs }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hello! I'm your Health Monetisation AI Coach. I see you're focusing on ${profile.specialization}. How can I help you reach your goals today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const gemini = new GeminiService();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Provide context: profile and recent logs
      const recentHistory = logs.slice(-3).map(l => 
        `Food: ${l.food}, Water: ${l.water}L, Exercise: ${l.exercise}`
      ).join(' | ');

      const contextPrompt = `
        User Profile: Age ${profile.age}, Gender ${profile.gender}, Goal ${profile.specialization}.
        Recent Activity Logs: ${recentHistory || 'No recent logs'}.
        User Question: ${userMessage}
      `;

      const response = await gemini.getChatResponse(contextPrompt, profile);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my knowledge base. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Proactive Health Coach</h2>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active • Gemini 3 Pro</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs text-slate-400 font-medium">Focusing on</p>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{profile.specialization}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your diet, latest logs, or health tips..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">AI-generated health coaching can vary. Consult a professional for medical advice.</p>
      </form>
    </div>
  );
};

export default HealthCoach;


import React, { useState } from 'react';
import { UserProfile, DailyLogEntry } from '../types';
import { GeminiService } from '../services/geminiService';

interface DailyLogProps {
  profile: UserProfile;
  onLogSaved: (entry: DailyLogEntry) => void;
}

const DailyLog: React.FC<DailyLogProps> = ({ profile, onLogSaved }) => {
  const [food, setFood] = useState('');
  const [water, setWater] = useState(0);
  const [exercise, setExercise] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  
  const gemini = new GeminiService();

  const handleGetTips = async () => {
    if (!food.trim() && !exercise.trim() && water === 0) return;
    setLoading(true);
    try {
      const aiFeedback = await gemini.getFeedbackOnActivity(profile, { food, water, exercise });
      setFeedback(aiFeedback);
      
      const newEntry: DailyLogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        food,
        water,
        exercise,
        aiFeedback: aiFeedback || "Keep up the healthy choices!"
      };
      
      onLogSaved(newEntry);
      
      // Optional: Clear after a delay or keep for user to read
      // For this app, we'll keep the feedback visible but maybe clear inputs
      setFood('');
      setWater(0);
      setExercise('');
    } catch (error) {
      console.error(error);
      setFeedback("Couldn't generate tips right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Health Journal Entry</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">What did you eat today?</label>
              <textarea 
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="e.g. Scrambled eggs for breakfast, Quinoa bowl for lunch..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 min-h-[100px] resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Hydration (Liters)</label>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <input 
                    type="range" 
                    min="0" 
                    max="5" 
                    step="0.1"
                    value={water}
                    onChange={(e) => setWater(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="min-w-[40px] text-center font-bold text-indigo-600">{water}L</span>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Physical Activity</label>
                <input 
                  type="text"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  placeholder="e.g. 45 min swimming, 5k run"
                  className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                />
              </div>
            </div>

            <button
              onClick={handleGetTips}
              disabled={loading || (!food.trim() && !exercise.trim() && water === 0)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating AI Analysis...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Log Entry & Get Feedback
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:w-1/3 bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16"></div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 z-10">AI Health Coach</h3>
          
          {feedback ? (
            <div className="flex-1 z-10">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100 animate-fade-in">
                <p className="text-slate-700 leading-relaxed italic text-sm">
                  "{feedback}"
                </p>
              </div>
              <p className="mt-4 text-[10px] text-slate-400 font-medium">Feedback based on your {profile.specialization} profile.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 space-y-4 z-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z"/></svg>
              </div>
              <p className="text-sm px-4">Log today's intake to receive personalized advice from our AI medical assistant.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyLog;

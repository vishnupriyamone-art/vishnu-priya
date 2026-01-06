
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { GeminiService } from '../services/geminiService';

interface DailyLogProps {
  profile: UserProfile;
}

const DailyLog: React.FC<DailyLogProps> = ({ profile }) => {
  const [food, setFood] = useState('');
  const [water, setWater] = useState(0);
  const [exercise, setExercise] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  
  const gemini = new GeminiService();

  const handleGetTips = async () => {
    if (!food && !exercise && water === 0) return;
    setLoading(true);
    try {
      const result = await gemini.getFeedbackOnActivity(profile, { food, water, exercise });
      setFeedback(result);
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
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Daily Health Input</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Food Intake Today</label>
              <textarea 
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="Describe your meals (e.g., Oatmeal for breakfast, chicken salad for lunch...)"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Water Intake (Liters)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="5" 
                    step="0.1"
                    value={water}
                    onChange={(e) => setWater(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="w-12 text-center font-bold text-indigo-600">{water}L</span>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Exercise Performed</label>
                <input 
                  type="text"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  placeholder="e.g., 30 min jogging, yoga"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                />
              </div>
            </div>

            <button
              onClick={handleGetTips}
              disabled={loading || (!food && !exercise && water === 0)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing Lifestyle...
                </>
              ) : 'Get Personalized Health Tips'}
            </button>
          </div>
        </div>

        <div className="lg:w-1/3 bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">AI Coaching Insight</h3>
          {feedback ? (
            <div className="flex-1 text-slate-700 leading-relaxed animate-fade-in italic">
              "{feedback}"
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
              <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <p className="text-sm">Log your activities to receive custom advice based on your ${profile.specialization} profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyLog;

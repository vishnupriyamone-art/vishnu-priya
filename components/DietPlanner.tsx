
import React, { useState } from 'react';
import { UserProfile, DietPlan } from '../types';
import { GeminiService } from '../services/geminiService';

interface DietPlannerProps {
  profile: UserProfile;
}

const DietPlanner: React.FC<DietPlannerProps> = ({ profile }) => {
  const [dietPlan, setDietPlan] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const gemini = new GeminiService();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const plan = await gemini.generateWeeklyDiet(profile);
      setDietPlan(plan);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Weekly Diet Plan</h2>
          <p className="text-slate-500 text-sm">Personalized for your {profile.specialization} lifestyle.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-200"
        >
          {loading ? 'Analyzing Profile...' : 'Generate New Plan'}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Crafting your perfect meal sequence...</p>
        </div>
      )}

      {!loading && dietPlan.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dietPlan.map((day, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-indigo-600">{day.day}</h3>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold">{day.calories} kcal</span>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-widest">Breakfast</span>
                  <p className="text-slate-700 leading-tight">{day.breakfast}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-widest">Lunch</span>
                  <p className="text-slate-700 leading-tight">{day.lunch}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-widest">Dinner</span>
                  <p className="text-slate-700 leading-tight">{day.dinner}</p>
                </div>
                <div className="pt-2 border-t border-slate-50">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-widest">Snacks</span>
                  <p className="text-indigo-900 font-medium">{day.snacks}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && dietPlan.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">Click generate to see your AI-powered weekly nutrition plan.</p>
        </div>
      )}
    </div>
  );
};

export default DietPlanner;

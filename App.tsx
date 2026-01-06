
import React, { useState, useEffect } from 'react';
import { UserProfile, HealthMetric, DailyLogEntry } from './types';
import { GeminiService } from './services/geminiService';
import Dashboard from './components/Dashboard';
import DietPlanner from './components/DietPlanner';
import VoiceAssistant from './components/VoiceAssistant';
import HealthSearch from './components/HealthSearch';
import HealthCoach from './components/HealthCoach';

const INITIAL_METRICS: HealthMetric[] = [
  { date: 'Mon', steps: 8400, caloriesBurned: 2100, waterIntake: 2.1 },
  { date: 'Tue', steps: 11200, caloriesBurned: 2450, waterIntake: 2.8 },
  { date: 'Wed', steps: 7900, caloriesBurned: 1980, waterIntake: 1.9 },
  { date: 'Thu', steps: 9500, caloriesBurned: 2200, waterIntake: 2.4 },
  { date: 'Fri', steps: 12100, caloriesBurned: 2600, waterIntake: 3.0 },
  { date: 'Sat', steps: 10400, caloriesBurned: 2300, waterIntake: 2.5 },
  { date: 'Sun', steps: 6000, caloriesBurned: 1700, waterIntake: 1.5 },
];

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    age: 28,
    weight: 75,
    height: 178,
    gender: 'Male',
    activityLevel: 'Moderate',
    specialization: 'Muscle Gain',
    stepGoal: 10000
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'coach' | 'diet' | 'voice' | 'search'>('dashboard');
  const [quickTip, setQuickTip] = useState('Drink water as soon as you wake up.');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [logs, setLogs] = useState<DailyLogEntry[]>([]);
  
  const gemini = new GeminiService();

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const tip = await gemini.getQuickTip(profile);
        setQuickTip(tip);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.specialization, profile.age]);

  const handleLogSaved = (newEntry: DailyLogEntry) => {
    setLogs(prev => [...prev, newEntry]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-white border-r border-slate-100 p-6 flex flex-col gap-8 sticky top-0 h-auto md:h-screen z-40 shadow-sm md:shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">HM</div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Health Monet</span>
        </div>

        <div className="flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'coach' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            AI Coach
          </button>
          <button 
            onClick={() => setActiveTab('diet')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'diet' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            Diet Planner
          </button>
          <button 
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'voice' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            Voice Coach
          </button>
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'search' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            Discovery
          </button>
        </div>

        <div className="mt-auto border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setIsProfileModalOpen(true)}>
            <div className="w-8 h-8 rounded-full bg-indigo-200 overflow-hidden">
               <img src="https://picsum.photos/100/100" alt="avatar" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">John Doe</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{profile.specialization}</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto h-full">
          {activeTab === 'dashboard' && <Dashboard metrics={INITIAL_METRICS} quickTip={quickTip} profile={profile} logs={logs} onLogSaved={handleLogSaved} />}
          {activeTab === 'coach' && <HealthCoach profile={profile} logs={logs} />}
          {activeTab === 'diet' && <DietPlanner profile={profile} />}
          {activeTab === 'voice' && <VoiceAssistant profile={profile} logs={logs} />}
          {activeTab === 'search' && <HealthSearch />}
        </div>
      </main>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Health Profile</h2>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Age</label>
                  <input 
                    type="number" 
                    value={profile.age} 
                    onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Gender</label>
                  <select 
                    value={profile.gender}
                    onChange={(e) => setProfile({...profile, gender: e.target.value})}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Specialization</label>
                <select 
                  value={profile.specialization}
                  onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Muscle Gain</option>
                  <option>Weight Loss</option>
                  <option>Diabetic Friendly</option>
                  <option>High Performance Athlete</option>
                  <option>Stress Reduction</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Daily Step Goal</label>
                <input 
                  type="number" 
                  value={profile.stepGoal} 
                  onChange={(e) => setProfile({...profile, stepGoal: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 10000"
                />
              </div>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold mt-4 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                Save & Update Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

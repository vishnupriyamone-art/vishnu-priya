
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { HealthMetric, UserProfile, DailyLogEntry } from '../types';
import DailyLog from './DailyLog';

interface DashboardProps {
  metrics: HealthMetric[];
  quickTip: string;
  profile: UserProfile;
  logs: DailyLogEntry[];
  onLogSaved: (entry: DailyLogEntry) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, quickTip, profile, logs, onLogSaved }) => {
  const formattedStepGoal = profile.stepGoal >= 1000 ? `${profile.stepGoal / 1000}k` : profile.stepGoal;

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Image and Tip */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 min-h-[220px] flex flex-col md:flex-row items-center shadow-xl shadow-slate-200">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200" 
            alt="Wellness background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-8 md:p-10 flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">Health Overview</h1>
          <p className="text-slate-300 mb-6">Track your vitals and stay ahead of your fitness goals.</p>
          
          <div className="inline-flex flex-col bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl max-w-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Live Health Tip</p>
            </div>
            <p className="text-white text-lg font-medium leading-tight">
              "{quickTip}"
            </p>
          </div>
        </div>

        <div className="relative z-10 hidden lg:block pr-10">
          <div className="w-32 h-32 rounded-full border-4 border-indigo-500/30 flex items-center justify-center bg-indigo-500/10 backdrop-blur-sm">
             <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
             </svg>
          </div>
        </div>
      </div>

      {/* New Activity Input Section */}
      <DailyLog profile={profile} onLogSaved={onLogSaved} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Steps Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium group-hover:text-emerald-600 transition-colors">Daily Steps</h3>
            <span className="text-emerald-500 text-xs font-bold px-2 py-1 bg-emerald-50 rounded-full">Goal: {formattedStepGoal}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-800">{metrics[metrics.length - 1]?.steps.toLocaleString()}</p>
            <span className="text-slate-400 text-sm font-medium">steps</span>
          </div>
          <div className="h-40 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="steps" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calories Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:border-orange-200 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium group-hover:text-orange-600 transition-colors">Calories Burned</h3>
            <span className="text-orange-500 text-xs font-bold px-2 py-1 bg-orange-50 rounded-full">Target: 2200</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-800">{metrics[metrics.length - 1]?.caloriesBurned}</p>
            <span className="text-slate-400 text-sm font-medium">kcal</span>
          </div>
          <div className="h-40 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="caloriesBurned" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium group-hover:text-blue-600 transition-colors">Water Intake</h3>
            <span className="text-blue-500 text-xs font-bold px-2 py-1 bg-blue-50 rounded-full">Limit: 3L</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-3xl font-bold text-slate-800">{metrics[metrics.length - 1]?.waterIntake}</p>
            <span className="text-slate-400 text-sm font-medium">liters</span>
          </div>
          
          <div className="space-y-4">
            <div className="relative w-full bg-slate-100 rounded-2xl h-3 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-1000 ease-out flex items-center justify-center relative" 
                style={{ width: `${Math.min((metrics[metrics.length - 1]?.waterIntake / 3) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 font-medium flex justify-between">
              <span>Hydration progress</span>
              <span>{Math.round((metrics[metrics.length - 1]?.waterIntake / 3) * 100)}%</span>
            </p>

            <div className="h-32 mt-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Weekly Trend</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" hide />
                  <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="waterIntake" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Logs Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Recent Activity Journal
        </h2>
        
        {logs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400 shadow-sm">
            <p>Your journal is empty. Log your first meal or exercise session above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logs.slice().reverse().map((log) => (
              <div key={log.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="w-2 h-2 rounded-full bg-indigo-200"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-300"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {log.food && (
                    <div className="flex gap-3">
                      <span className="text-amber-500 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                      </span>
                      <p className="text-sm text-slate-700 font-medium line-clamp-2">{log.food}</p>
                    </div>
                  )}
                  {log.water > 0 && (
                    <div className="flex gap-3">
                      <span className="text-blue-500 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.5c-3.3 0-6-2.7-6-6 0-3.3 6-12 6-12s6 8.7 6 12c0 3.3-2.7 6-6 6z"/></svg>
                      </span>
                      <p className="text-sm text-slate-700 font-medium">{log.water}L Water consumed</p>
                    </div>
                  )}
                  {log.exercise && (
                    <div className="flex gap-3">
                      <span className="text-indigo-500 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2V15.5L13 13.6l.6-3c1.2 1.5 2.9 2.4 4.4 2.4V11c-1.3 0-2.4-.6-3.2-1.6l-1-1.6c-.4-.6-1-.9-1.6-.9-.3 0-.5.1-.8.2L6 8.3V13h2V9.6l1.8-.7z"/></svg>
                      </span>
                      <p className="text-sm text-slate-700 font-medium">{log.exercise}</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-[0.15em]">Coach AI</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed italic line-clamp-3">
                    "{log.aiFeedback}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

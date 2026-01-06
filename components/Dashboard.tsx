
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { HealthMetric, UserProfile } from '../types';
import DailyLog from './DailyLog';

interface DashboardProps {
  metrics: HealthMetric[];
  quickTip: string;
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, quickTip, profile }) => {
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
      <DailyLog profile={profile} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Steps Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium group-hover:text-emerald-600 transition-colors">Daily Steps</h3>
            <span className="text-emerald-500 text-xs font-bold px-2 py-1 bg-emerald-50 rounded-full">Goal: 10k</span>
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
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-800">{metrics[metrics.length - 1]?.waterIntake}</p>
            <span className="text-slate-400 text-sm font-medium">liters</span>
          </div>
          <div className="mt-6 flex flex-col justify-end h-[160px]">
            <div className="relative w-full bg-slate-100 rounded-2xl h-10 mb-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-1000 ease-out flex items-center justify-center relative" 
                style={{ width: `${(metrics[metrics.length - 1]?.waterIntake / 3) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium flex justify-between">
              <span>Hydration progress</span>
              <span>{Math.round((metrics[metrics.length - 1]?.waterIntake / 3) * 100)}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

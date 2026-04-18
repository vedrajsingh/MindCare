import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { loadSessions } from '../utils/aiSimulator';
import { Activity, Heart, TrendingUp, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Standardize dates to short string for chart
    const rawData = loadSessions();
    const formattedData = rawData.map((session, i) => {
      const dateObj = new Date(session.date);
      return {
        name: `Session ${i + 1}`,
        fullDate: dateObj.toLocaleDateString(),
        score: session.avgScore,
        messages: session.messageCount || 0
      };
    });
    setData(formattedData);
  }, []);

  const getLatestMood = () => {
    if (data.length === 0) return { label: 'Neutral', color: 'text-slate-400' };
    const latest = data[data.length - 1].score;
    if (latest >= 60) return { label: 'Positive', color: 'text-emerald-400' };
    if (latest <= 40) return { label: 'Struggling', color: 'text-indigo-400' };
    return { label: 'Neutral', color: 'text-blue-400' };
  };

  const moodDetails = getLatestMood();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 max-w-5xl mx-auto w-full"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Activity className="text-indigo-500 w-8 h-8" />
          Emotional Insights
        </h2>
        <p className="text-slate-400 mt-2">Track how you've been feeling across your sessions with MindCare.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Heart className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-slate-400 font-medium tracking-wide">Current Mood Trend</h3>
          </div>
          <p className={`text-3xl font-bold mt-4 ${moodDetails.color}`}>{moodDetails.label}</p>
        </div>
        
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <CalendarDays className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-slate-400 font-medium tracking-wide">Total Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100 mt-4">{data.length}</p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-slate-400 font-medium tracking-wide">Avg Interaction</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100 mt-4">
            {data.length ? Math.round(data.reduce((acc, curr) => acc + curr.messages, 0) / data.length) : 0} <span className="text-lg text-slate-500 font-normal">msgs/session</span>
          </p>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold text-slate-200 mb-6">Longitudinal Emotional Tracking</h3>
        
        <div className="h-[400px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  domain={[0, 100]} 
                  tick={{ fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#818cf8" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  activeDot={{ r: 6, fill: '#818cf8', stroke: '#1e293b', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              No session data available yet. Start chatting to build your timeline!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

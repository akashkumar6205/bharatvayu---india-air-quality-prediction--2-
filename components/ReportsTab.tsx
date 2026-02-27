
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const monthlyData = [
  { month: 'Jan', aqi: 145, temp: 12 },
  { month: 'Feb', aqi: 132, temp: 15 },
  { month: 'Mar', aqi: 110, temp: 18 },
  { month: 'Apr', aqi: 95, temp: 22 },
  { month: 'May', aqi: 88, temp: 28 },
  { month: 'Jun', aqi: 75, temp: 32 },
  { month: 'Jul', aqi: 68, temp: 34 },
  { month: 'Aug', aqi: 72, temp: 33 },
  { month: 'Sep', aqi: 98, temp: 29 },
  { month: 'Oct', aqi: 125, temp: 24 },
  { month: 'Nov', aqi: 185, temp: 18 },
  { month: 'Dec', aqi: 195, temp: 13 },
];

const pollutantData = [
  { name: 'PM2.5', value: 45, color: '#6366f1' },
  { name: 'PM10', value: 25, color: '#8b5cf6' },
  { name: 'NO2', value: 15, color: '#ec4899' },
  { name: 'O3', value: 10, color: '#f59e0b' },
  { name: 'SO2', value: 5, color: '#10b981' },
];

const ReportsTab: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Environmental Insights</h1>
          <p className="text-slate-500 font-medium">Comprehensive historical analysis and pollution trends.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
          <i className="fa-solid fa-file-export"></i>
          Export Full Report
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg AQI (Yearly)', value: '115', sub: '-12% vs last year', icon: 'fa-chart-line', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Peak Pollution', value: '245', sub: 'Detected in Dec', icon: 'fa-arrow-trend-up', color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Good Air Days', value: '142', sub: '38% of the year', icon: 'fa-leaf', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Major Source', value: 'Traffic', sub: '45% contribution', icon: 'fa-car-side', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 my-1">{stat.value}</h3>
            <p className={`text-[10px] font-bold ${stat.sub.includes('-') || stat.sub.includes('Healthiest') ? 'text-emerald-500' : 'text-slate-400'}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Monthly AQI Trend (2024)</h3>
            <select className="bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-500 py-1 px-3 outline-none ring-1 ring-slate-100">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar 
                  dataKey="aqi" 
                  radius={[6, 6, 0, 0]}
                  name="Avg AQI"
                >
                  {monthlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.aqi > 150 ? '#f43f5e' : entry.aqi > 100 ? '#fb923c' : '#6366f1'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pollutant Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Pollutant Distribution</h3>
          <div className="flex-1 w-full min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pollutantData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pollutantData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Primary</p>
                <p className="text-sm font-black text-slate-800 leading-tight">PM2.5</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              *Analysis based on over 8,760 sensor data points collected annually.
            </p>
          </div>
        </div>
      </div>

      {/* Downloadable Reports Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 px-1">Report Archive</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Annual Environmental Audit 2023', size: '4.2 MB', date: 'Jan 2024' },
            { name: 'Urban Transport Impact Study', size: '2.1 MB', date: 'Dec 2023' },
            { name: 'Regional AQI Health Impact Report', size: '1.8 MB', date: 'Nov 2023' },
          ].map((report, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <i className="fa-solid fa-file-pdf text-lg"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">{report.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{report.size} • {report.date}</p>
                </div>
              </div>
              <i className="fa-solid fa-download text-slate-300 group-hover:text-indigo-600"></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;


import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoryPoint } from '../types';

interface HistoryChartProps {
  data: HistoryPoint[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Past 24h Trend</h2>
          <p className="text-[8px] text-slate-400 font-bold uppercase">Sensor Logs</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
             <span className="text-[8px] font-black text-slate-400 uppercase">AQI</span>
           </div>
        </div>
      </div>
      <div className="w-full h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 8}} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 8}} 
            />
            <Tooltip 
              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '9px'}}
            />
            <Line 
              type="monotone" 
              dataKey="aqi" 
              stroke="#f97316" 
              strokeWidth={2} 
              dot={false}
              name="AQI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryChart;

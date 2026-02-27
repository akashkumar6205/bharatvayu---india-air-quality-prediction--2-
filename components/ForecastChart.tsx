
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ForecastPoint } from '../types';

interface ForecastChartProps {
  data: ForecastPoint[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">AQI Prediction (AI)</h2>
        <span className="text-[8px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md font-black uppercase">
          Dynamic Model
        </span>
      </div>
      <div className="flex-1 w-full min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 9}} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 9}} 
            />
            <Tooltip 
              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px'}}
              itemStyle={{color: '#f97316', fontWeight: 'bold'}}
            />
            <Area 
              type="monotone" 
              dataKey="aqi" 
              stroke="#f97316" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorAqi)" 
            />
            <ReferenceLine y={50} stroke="#10b981" strokeDasharray="3 3" />
            <ReferenceLine y={100} stroke="#fbbf24" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastChart;

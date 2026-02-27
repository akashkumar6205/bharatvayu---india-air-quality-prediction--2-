
import React from 'react';
import { AQIData } from '../types';
import { getAQIInfo } from '../constants';

interface AqiCardProps {
  data: AQIData;
}

const AqiCard: React.FC<AqiCardProps> = ({ data }) => {
  const info = getAQIInfo(data.aqi);

  return (
    <div className={`rounded-2xl p-4 shadow-sm border ${info.border} bg-white flex flex-col`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Live Monitor</h2>
          <p className="text-base font-black text-slate-800 flex items-center gap-1">
            <i className="fa-solid fa-location-dot text-indigo-500 text-xs"></i>
            {data.location}
          </p>
        </div>
        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider ${info.color} text-white shadow-sm`}>
          {data.level}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 mb-4">
        {/* Simplified main circle for compact columns */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-50" />
            <circle 
              cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="6" fill="transparent" 
              strokeDasharray={314.159}
              strokeDashoffset={314.159 - (Math.min(data.aqi, 500) / 500) * 314.159}
              className={`${info.text.replace('text', 'text')}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black text-slate-900 leading-none">{data.aqi}</span>
            <span className="text-[8px] font-black text-slate-400 mt-0.5 uppercase">Index</span>
          </div>
        </div>

        {/* Dense pollutant grid */}
        <div className="grid grid-cols-2 gap-1.5 w-full">
          {Object.entries(data.pollutants).map(([key, value]) => (
            <div key={key} className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex flex-col justify-center">
              <p className="text-[7px] font-black text-slate-400 uppercase leading-none mb-0.5">{key.replace('_', '.')}</p>
              <p className="text-xs font-black text-slate-800 leading-none">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom weather stats */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-1">
        <div className="text-center">
          <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Temp</p>
          <p className="text-[10px] font-black text-slate-800">{data.weather.temp}°</p>
        </div>
        <div className="text-center">
          <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Hum</p>
          <p className="text-[10px] font-black text-slate-800">{data.weather.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Wind</p>
          <p className="text-[10px] font-black text-slate-800">{data.weather.windSpeed}k</p>
        </div>
      </div>
    </div>
  );
};

export default AqiCard;

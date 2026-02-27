
import React from 'react';
import { WeatherForecastPoint } from '../types';
import { getAQIInfo } from '../constants';

interface WeatherForecastProps {
  data: WeatherForecastPoint[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
          <i className="fa-solid fa-calendar-days text-sm"></i>
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-800">7-Day Outlook</h2>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Predictions</p>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {data.map((day, idx) => {
          const info = getAQIInfo(day.aqi);
          return (
            <div key={idx} className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col items-center text-center transition-transform hover:bg-white hover:shadow-sm">
              <span className="text-[8px] font-black text-slate-400 uppercase mb-1">{day.day.slice(0,3)}</span>
              <div className="text-sm mb-0.5">
                {day.condition.toLowerCase().includes('sun') ? '☀️' : day.condition.toLowerCase().includes('rain') ? '🌧️' : '☁️'}
              </div>
              <p className="text-[11px] font-black text-slate-800">{day.temp}°</p>
              <div className="mt-2 w-full">
                <div className={`h-1 w-full rounded-full ${info.color} opacity-40`}></div>
                <p className="text-[8px] font-black text-slate-500 mt-0.5">Q:{day.aqi}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;

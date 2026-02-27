
import React from 'react';
import { HealthAdvisory } from '../types';

interface AdvisorySectionProps {
  advisory: HealthAdvisory;
  sourceAnalysis: string;
}

const AdvisorySection: React.FC<AdvisorySectionProps> = ({ advisory, sourceAnalysis }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
            <i className="fa-solid fa-comment-medical text-sm"></i>
          </div>
          <h2 className="text-sm font-black text-slate-800">AI Health Advisor</h2>
        </div>
        <p className="text-slate-600 text-[11px] font-medium leading-relaxed mb-4">{advisory.general}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <h3 className="text-[8px] font-black text-blue-700 uppercase mb-1">Children</h3>
            <p className="text-[10px] text-blue-900 leading-tight font-medium">{advisory.children}</p>
          </div>
          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
            <h3 className="text-[8px] font-black text-amber-700 uppercase mb-1">Elderly</h3>
            <p className="text-[10px] text-amber-900 leading-tight font-medium">{advisory.elderly}</p>
          </div>
          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
            <h3 className="text-[8px] font-black text-purple-700 uppercase mb-1">Sensitive</h3>
            <p className="text-[10px] text-purple-900 leading-tight font-medium">{advisory.sensitiveGroups}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
            <i className="fa-solid fa-industry text-sm"></i>
          </div>
          <h2 className="text-sm font-black text-slate-800">Source Intel</h2>
        </div>
        <p className="text-slate-600 text-[11px] font-medium leading-relaxed mb-3 line-clamp-3">{sourceAnalysis}</p>
        
        <div className="flex flex-wrap gap-1.5">
          {advisory.activities.slice(0, 4).map((activity, idx) => (
            <span key={idx} className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md text-[9px] font-black border border-slate-100 uppercase tracking-tight">
              {activity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvisorySection;


import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    avatarSeed: Math.random().toString(36).substring(7),
    tier: 'Free',
    bio: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-50 p-6 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Branding */}
        <div className="md:w-5/12 bg-orange-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
              <i className="fa-solid fa-wind text-2xl"></i>
            </div>
            <h1 className="text-3xl font-black mb-4 leading-tight">Welcome to BharatVayu</h1>
            <p className="text-orange-100 text-sm font-medium leading-relaxed">India's personal portal for real-time air quality monitoring and predictive health insights.</p>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-orange-600 bg-orange-400 overflow-hidden shadow-lg">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-4 border-orange-600 bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px] font-bold">
                +50k
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-200">Safeguarding Lives in Bharat</p>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-orange-500 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-20%] w-64 h-64 bg-orange-700 rounded-full opacity-50 blur-3xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Create Your Profile</h2>
            <p className="text-slate-400 text-sm font-medium">Join the air quality movement.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-slate-100 p-1 shadow-inner overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.avatarSeed}`} 
                    alt="Avatar Preview" 
                    className="w-full h-full rounded-full"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, avatarSeed: Math.random().toString(36).substring(7)})}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <i className="fa-solid fa-rotate-right text-xs"></i>
                </button>
              </div>
              <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Your Avatar</p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Your Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all outline-none"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-orange-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Start Breathing Better
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-slate-400 font-medium">
            Join thousands of citizens across India.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

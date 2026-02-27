
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(user);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl mb-4">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.avatarSeed}`} 
                alt="Avatar Preview" 
                className="w-full h-full rounded-full"
              />
            </div>
            <button 
              onClick={() => setFormData({...formData, avatarSeed: Math.random().toString(36).substring(7)})}
              className="absolute bottom-4 right-0 w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              title="Randomize Avatar"
            >
              <i className="fa-solid fa-rotate text-xs"></i>
            </button>
          </div>
          <h2 className="text-xl font-black">Edit Your Profile</h2>
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">SkyGuard Personalization</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Avatar Theme Seed</label>
            <input 
              type="text" 
              value={formData.avatarSeed}
              onChange={e => setFormData({...formData, avatarSeed: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Random text for avatar generation"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Short Bio</label>
            <textarea 
              rows={2}
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;

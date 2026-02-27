
import React, { useState, useEffect, useRef } from 'react';
import { MAP_MARKERS, getAQIInfo } from '../constants';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  lang: 'EN' | 'HI';
  setLang: (lang: 'EN' | 'HI') => void;
  onProfileClick: () => void;
  onSearch: (location: string) => void;
  onNearby: () => void;
  avatarSeed: string;
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onProfileClick,
  onSearch,
  onNearby,
  avatarSeed
}) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<typeof MAP_MARKERS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const t = {
    EN: {
      dashboard: "Dashboard",
      map: "India Map",
      guidelines: "Guidelines",
      reports: "Reports",
      about: "About",
      searchPlaceholder: "Search city...",
    },
    HI: {
      dashboard: "डैशबोर्ड",
      map: "भारत मानचित्र",
      guidelines: "निर्देश",
      reports: "रिपोर्ट",
      about: "परिचय",
      searchPlaceholder: "शहर खोजें...",
    }
  }[lang];

  useEffect(() => {
    if (search.trim().length > 0) {
      const filtered = MAP_MARKERS.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onSearch(search);
      setSearch('');
      setShowSuggestions(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: 'fa-house' },
    { id: 'map', label: t.map, icon: 'fa-location-dot' },
    { id: 'guidelines', label: t.guidelines, icon: 'fa-book' },
    { id: 'reports', label: t.reports, icon: 'fa-chart-pie' },
    { id: 'about', label: t.about, icon: 'fa-circle-info' },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-white border-b border-slate-100 shadow-sm px-4 h-16 flex items-center justify-between gap-4">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-100">
          <i className="fa-solid fa-wind text-lg"></i>
        </div>
        <span className="hidden xl:block text-lg font-black text-slate-900 tracking-tight">
          Bharat<span className="text-orange-600">Vayu</span>
        </span>
      </div>

      {/* Navigation Links + Compact Search */}
      <div className="flex-1 flex items-center justify-center gap-1 md:gap-4">
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-tight transition-all flex items-center gap-1.5 ${activeTab === item.id ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <i className={`fa-solid ${item.icon} text-[10px]`}></i>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Small Search Bar */}
        <div className="relative w-full max-w-[180px] md:max-w-[240px]" ref={suggestionsRef}>
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => search.length > 0 && setShowSuggestions(true)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all text-xs font-bold text-slate-700 placeholder:text-slate-400"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] group-focus-within:text-orange-500"></i>
            <button 
              type="button" 
              onClick={onNearby}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-600"
            >
              <i className="fa-solid fa-location-crosshairs text-[10px]"></i>
            </button>
          </form>

          {/* Mini Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-1 duration-200">
              {suggestions.map((city) => {
                const info = getAQIInfo(city.aqi);
                return (
                  <button 
                    key={city.name} 
                    onClick={() => { onSearch(city.name); setSearch(''); setShowSuggestions(false); }} 
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-orange-50 transition-all text-left border-b border-slate-50 last:border-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-700">{city.name}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase leading-none">{info.level}</span>
                    </div>
                    <div className={`px-1.5 py-0.5 rounded-md ${info.color} text-white text-[9px] font-black shadow-sm`}>
                      {city.aqi}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
          className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 text-slate-600 font-bold text-[10px] rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors uppercase border border-slate-100 shadow-sm"
        >
          {lang}
        </button>

        <div
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-orange-100 p-0.5 overflow-hidden cursor-pointer hover:border-orange-500 transition-all shadow-sm"
          onClick={onProfileClick}
        >
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
            alt="p"
            className="w-full h-full rounded-full bg-slate-100"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

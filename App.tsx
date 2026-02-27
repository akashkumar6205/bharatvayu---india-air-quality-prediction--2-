
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AQIData, AIAnalysis, AQILevel, UserProfile } from './types';
import { getAIAnalysis } from './services/geminiService';
import AqiCard from './components/AqiCard';
import ForecastChart from './components/ForecastChart';
import AdvisorySection from './components/AdvisorySection';
import ChatWidget from './components/ChatWidget';
import HistoryChart from './components/HistoryChart';
import WeatherForecast from './components/WeatherForecast';
import ReportsTab from './components/ReportsTab';
import GuidelinesTab from './components/GuidelinesTab';
import ProfileModal from './components/ProfileModal';
import Onboarding from './components/Onboarding';
import Navbar from './components/Navbar';
import { getAQIInfo, MAP_MARKERS } from './constants';

type TabType = 'dashboard' | 'map' | 'guidelines' | 'reports' | 'about';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<AQIData | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<typeof MAP_MARKERS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bharatvayu_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const t = {
    EN: {
      dashboard: "Dashboard",
      loading: "Locating city...",
      analyzing: "AI is predicting...",
      heroTitle: "Bharat Air Quality",
      heroSub: "Search any Indian city for real-time AQI and AI-powered health forecasts.",
      searchPlaceholder: "Search your city (e.g. New Delhi, Mumbai...)",
      popularSuggestions: "Suggested results",
      nearby: "Use Current Location"
    },
    HI: {
      dashboard: "डैशबोर्ड",
      loading: "शहर खोज रहे हैं...",
      analyzing: "भविष्यवाणी हो रही है...",
      heroTitle: "भारत वायु गुणवत्ता",
      heroSub: "वास्तविक समय AQI और AI-संचालित स्वास्थ्य पूर्वानुमान के लिए किसी भी भारतीय शहर को खोजें।",
      searchPlaceholder: "अपना शहर खोजें (जैसे: नई दिल्ली, मुंबई...)",
      popularSuggestions: "सुझाए गए परिणाम",
      nearby: "वर्तमान स्थान का उपयोग करें"
    }
  }[lang];

  const fetchWeatherData = useCallback(async (location: string) => {
    if (!location) return;
    setLoading(true);
    setAnalysis(null);
    setData(null);
    setShowSuggestions(false);
    setActiveTab('dashboard');
    
    try {
      const existing = MAP_MARKERS.find(m => m.name.toLowerCase() === location.toLowerCase());
      const mockAqi = existing ? existing.aqi : Math.floor(Math.random() * 280) + 20;
      const mockLevel = mockAqi <= 50 ? AQILevel.GOOD : 
                       mockAqi <= 100 ? AQILevel.MODERATE : 
                       mockAqi <= 150 ? AQILevel.UNHEALTHY_SENSITIVE : 
                       mockAqi <= 200 ? AQILevel.UNHEALTHY : AQILevel.VERY_UNHEALTHY;

      const mockData: AQIData = {
        aqi: mockAqi,
        location: location,
        timestamp: new Date().toISOString(),
        level: mockLevel,
        color: '',
        pollutants: {
          pm2_5: Math.round(mockAqi * 0.45 * 10) / 10, pm10: Math.round(mockAqi * 0.7 * 10) / 10,
          no2: Math.round(Math.random() * 40 * 10) / 10, so2: Math.round(Math.random() * 10 * 10) / 10,
          co: Math.round(Math.random() * 2 * 10) / 10, o3: Math.round(Math.random() * 60 * 10) / 10,
        },
        weather: { temp: 20 + Math.floor(Math.random() * 15), humidity: 30 + Math.floor(Math.random() * 50), windSpeed: 4 + Math.floor(Math.random() * 12), description: 'Clear Skies' }
      };

      setData(mockData);
      setLoading(false);
      setIsAnalyzing(true);
      const aiResult = await getAIAnalysis(mockData);
      setAnalysis(aiResult);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleNearbySearch = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        () => { fetchWeatherData("New Delhi"); },
        () => { alert("Geolocation denied. Loading New Delhi."); fetchWeatherData("New Delhi"); }
      );
    }
  };

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
      fetchWeatherData(search);
      setSearch('');
    }
  };

  useEffect(() => {
    if (activeTab === 'map' && mapContainerRef.current) {
      const L = (window as any).L;
      if (!L || !user || mapInstanceRef.current) return;
      
      const map = L.map(mapContainerRef.current).setView([22.5937, 78.9629], 5);
      mapInstanceRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      MAP_MARKERS.forEach(marker => {
        const info = getAQIInfo(marker.aqi);
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="aqi-marker aqi-marker-pulse ${info.color}">${marker.aqi}</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });
        L.marker(marker.coords as [number, number], { icon }).addTo(map)
          .bindPopup(`<b>${marker.name}</b><br>AQI: ${marker.aqi}<br>Status: ${info.level}`);
      });

      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 400);
    }
    
    return () => {
      if (activeTab !== 'map' && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, user]);

  if (!user) return <Onboarding onComplete={(p) => { setUser(p); localStorage.setItem('bharatvayu_profile', JSON.stringify(p)); }} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 sm:pb-4">
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onProfileClick={() => setIsProfileModalOpen(true)}
        onSearch={fetchWeatherData}
        onNearby={handleNearbySearch}
        avatarSeed={user.avatarSeed}
      />

      <main className="max-w-7xl mx-auto w-full px-4 flex-1 mt-6">
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            {/* Main Search Section (Hero) */}
            <div className={`transition-all duration-700 ${data ? 'mb-8' : 'py-16'}`}>
              {!data && (
                <div className="max-w-3xl mx-auto text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                    {t.heroTitle}
                  </h1>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed px-4">
                    {t.heroSub}
                  </p>
                </div>
              )}

              {/* Big Search Bar - only show when no data is loaded */}
              {!data && (
                <div className="max-w-2xl mx-auto relative" ref={suggestionsRef}>
                  <form onSubmit={handleSearchSubmit} className="relative group shadow-2xl shadow-orange-100 rounded-[2rem]">
                    <input 
                      type="text" 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)} 
                      onFocus={() => search.length > 0 && setShowSuggestions(true)}
                      placeholder={t.searchPlaceholder} 
                      className="w-full pl-14 pr-32 py-5 bg-white border border-slate-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-orange-50 transition-all text-base font-bold text-slate-700 placeholder:text-slate-300 shadow-sm" 
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500">
                      <i className="fa-solid fa-magnifying-glass text-xl"></i>
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={handleNearbySearch} 
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-orange-600 rounded-2xl transition-all"
                        title={t.nearby}
                      >
                        <i className="fa-solid fa-location-crosshairs"></i>
                      </button>
                      <button 
                        type="submit" 
                        className="px-6 py-2.5 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
                      >
                        GO
                      </button>
                    </div>
                  </form>

                  {/* Inline Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.popularSuggestions}</p>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {suggestions.map((city) => {
                          const info = getAQIInfo(city.aqi);
                          return (
                            <button 
                              key={city.name} 
                              onClick={() => { fetchWeatherData(city.name); setSearch(''); }} 
                              className="w-full px-6 py-4 flex items-center justify-between hover:bg-orange-50 transition-all group border-b border-slate-50 last:border-0"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-orange-500 group-hover:border-orange-200 transition-all">
                                  <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="text-base font-bold text-slate-800 group-hover:text-orange-600">{city.name}</span>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{info.level}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                  <span className="text-[8px] font-black text-slate-300 uppercase leading-none">Index</span>
                                  <span className={`text-lg font-black ${info.text}`}>{city.aqi}</span>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${info.color} shadow-sm animate-pulse`}></div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Select Chips */}
              {!data && !loading && (
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {["New Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad"].map(city => (
                    <button 
                      key={city} 
                      onClick={() => fetchWeatherData(city)} 
                      className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-6 shadow-xl shadow-orange-100"></div>
                <p className="text-slate-400 text-sm font-black uppercase tracking-widest animate-pulse">{t.loading}</p>
              </div>
            ) : data ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-10 duration-700">
                <div className="lg:col-span-4 space-y-6">
                  <AqiCard data={data} />
                  {isAnalyzing ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 h-64 animate-pulse shadow-sm flex flex-col items-center justify-center">
                       <i className="fa-solid fa-chart-line text-slate-100 text-6xl mb-4"></i>
                       <div className="h-2 w-32 bg-slate-50 rounded-full"></div>
                    </div>
                  ) : analysis && <HistoryChart data={analysis.history} />}
                </div>
                <div className="lg:col-span-8 space-y-6">
                   {!isAnalyzing && analysis && <WeatherForecast data={analysis.weatherForecast} />}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isAnalyzing ? (
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 h-[350px] flex flex-col justify-center items-center shadow-sm">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{t.analyzing}</p>
                      </div>
                    ) : analysis && (
                      <>
                        <ForecastChart data={analysis.forecast} />
                        <AdvisorySection advisory={analysis.advisory} sourceAnalysis={analysis.sourceAnalysis} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
        
        {activeTab === 'map' && <div className="bg-white rounded-[2.5rem] overflow-hidden h-[calc(100vh-180px)] relative border border-slate-100 shadow-sm"><div ref={mapContainerRef} className="absolute inset-0"></div></div>}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'guidelines' && <GuidelinesTab lang={lang} />}
        {activeTab === 'about' && (
          <div className="py-20 max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-orange-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-orange-200 rotate-3 transition-transform hover:rotate-0">
              <i className="fa-solid fa-wind text-5xl"></i>
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">BharatVayu AI</h1>
            <p className="text-slate-500 text-xl leading-relaxed mb-12 font-medium italic">"Swachh Vayu, Swasth Bharat"</p>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation (Persistent) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] sm:hidden z-[150]">
        <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] p-1.5 flex justify-around items-center border border-white/10 shadow-2xl">
          {[
            { id: 'dashboard', icon: 'fa-house' },
            { id: 'map', icon: 'fa-location-dot' },
            { id: 'guidelines', icon: 'fa-book' },
            { id: 'reports', icon: 'fa-chart-pie' },
            { id: 'about', icon: 'fa-circle-info' },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as TabType)} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'text-orange-500 bg-white/10 scale-105' : 'text-slate-400 hover:text-white'}`}>
              <i className={`fa-solid ${item.icon} text-lg`}></i>
            </button>
          ))}
        </div>
      </div>

      <ChatWidget />
      <ProfileModal 
        user={user!} 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        onSave={(p) => { 
          setUser(p); 
          localStorage.setItem('bharatvayu_profile', JSON.stringify(p)); 
        }} 
      />
    </div>
  );
};

export default App;

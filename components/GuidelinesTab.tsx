
import React from 'react';

interface GuidelinesTabProps {
  lang: 'EN' | 'HI';
}

const GuidelinesTab: React.FC<GuidelinesTabProps> = ({ lang }) => {
  const content = {
    EN: {
      title: "Public Health Guidelines",
      subtitle: "Official standards and government directives for air quality management.",
      govSection: "Government Section: NAQI Standards",
      govDesc: "The National Air Quality Index (NAQI) is the standard used by the government to communicate air quality status to the public.",
      grapTitle: "Graded Response Action Plan (GRAP)",
      grapDesc: "Institutional measures triggered based on air quality severity to prevent further deterioration.",
      levels: [
        { range: "0 - 50", label: "Good", impact: "Minimal Impact", color: "bg-emerald-500" },
        { range: "51 - 100", label: "Satisfactory", impact: "Minor breathing discomfort to sensitive people", color: "bg-emerald-400" },
        { range: "101 - 200", label: "Moderate", impact: "Breathing discomfort to people with lungs, asthma and heart diseases", color: "bg-yellow-400" },
        { range: "201 - 300", label: "Poor", impact: "Breathing discomfort to most people on prolonged exposure", color: "bg-orange-400" },
        { range: "301 - 400", label: "Very Poor", impact: "Respiratory illness on prolonged exposure", color: "bg-rose-500" },
        { range: "401 - 500", label: "Severe", impact: "Affects healthy people and seriously impacts those with existing diseases", color: "bg-red-700" }
      ],
      directives: [
        { stage: "Stage I (Poor)", measure: "Ban on coal/firewood in hotels, open eateries; strict enforcement of dust control." },
        { stage: "Stage II (Very Poor)", measure: "Stop use of diesel generators; increase parking fees to discourage private transport." },
        { stage: "Stage III (Severe)", measure: "Closure of construction sites; ban on non-essential mining activities; restrictions on older vehicles." },
        { stage: "Stage IV (Severe+)", measure: "Stop entry of trucks into the city; potential school closures and work-from-home orders." }
      ]
    },
    HI: {
      title: "सार्वजनिक स्वास्थ्य दिशा-निर्देश",
      subtitle: "वायु गुणवत्ता प्रबंधन के लिए आधिकारिक मानक और सरकारी निर्देश।",
      govSection: "सरकारी अनुभाग: NAQI मानक",
      govDesc: "राष्ट्रीय वायु गुणवत्ता सूचकांक (NAQI) वह मानक है जिसका उपयोग सरकार जनता को वायु गुणवत्ता की स्थिति बताने के लिए करती है।",
      grapTitle: "श्रेणीबद्ध प्रतिक्रिया कार्य योजना (GRAP)",
      grapDesc: "वायु गुणवत्ता की गंभीरता के आधार पर स्थिति को और बिगड़ने से रोकने के लिए लागू किए गए संस्थागत उपाय।",
      levels: [
        { range: "0 - 50", label: "अच्छा", impact: "न्यूनतम प्रभाव", color: "bg-emerald-500" },
        { range: "51 - 100", label: "संतोषजनक", impact: "संवेदनशील लोगों को सांस लेने में हल्की परेशानी", color: "bg-emerald-400" },
        { range: "101 - 200", label: "मध्यम", impact: "फेफड़े, अस्थमा और हृदय रोगों वाले लोगों को सांस लेने में परेशानी", color: "bg-yellow-400" },
        { range: "201 - 300", label: "खराब", impact: "लंबे समय तक संपर्क में रहने पर अधिकांश लोगों को सांस लेने में परेशानी", color: "bg-orange-400" },
        { range: "301 - 400", label: "बहुत खराब", impact: "लंबे समय तक संपर्क में रहने पर श्वसन संबंधी बीमारी", color: "bg-rose-500" },
        { range: "401 - 500", label: "गंभीर", impact: "स्वस्थ लोगों को प्रभावित करता है और मौजूदा बीमारियों वालों पर गंभीर प्रभाव डालता है", color: "bg-red-700" }
      ],
      directives: [
        { stage: "चरण I (खराब)", measure: "होटलों, खुले भोजनालयों में कोयले/लकड़ी पर प्रतिबंध; धूल नियंत्रण का सख्त प्रवर्तन।" },
        { stage: "चरण II (बहुत खराब)", measure: "डीजल जनरेटर का उपयोग बंद करें; निजी परिवहन को हतोत्साहित करने के लिए पार्किंग शुल्क बढ़ाएँ।" },
        { stage: "चरण III (गंभीर)", measure: "निर्माण स्थलों को बंद करना; गैर-जरूरी खनन गतिविधियों पर प्रतिबंध; पुराने वाहनों पर प्रतिबंध।" },
        { stage: "चरण IV (अति गंभीर)", measure: "शहर में ट्रकों के प्रवेश पर रोक; संभावित स्कूल बंदी और वर्क-फ्रॉम-होम आदेश।" }
      ]
    }
  }[lang];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 py-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">{content.title}</h1>
          <p className="text-slate-500 font-medium">{content.subtitle}</p>
        </div>

        {/* Government Section Badge */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl mb-6 shadow-xl shadow-slate-200">
            <i className="fa-solid fa-building-columns text-sm"></i>
            <span className="text-xs font-black uppercase tracking-widest">{content.govSection}</span>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <p className="text-slate-600 mb-8 leading-relaxed font-medium">{content.govDesc}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.levels.map((level, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors">
                  <div className={`w-14 h-14 ${level.color} rounded-xl shrink-0 flex items-center justify-center text-white text-[10px] font-black text-center leading-tight shadow-lg`}>
                    {level.range}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm mb-0.5">{level.label}</h4>
                    <p className="text-[11px] text-slate-500 leading-tight font-medium">{level.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GRAP Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{content.grapTitle}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{lang === 'EN' ? 'Institutional Directives' : 'संस्थागत निर्देश'}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <p className="text-slate-500 mb-8 text-sm font-medium italic">{content.grapDesc}</p>
            
            <div className="space-y-4">
              {content.directives.map((dir, idx) => (
                <div key={idx} className="relative pl-8 pb-6 last:pb-0 border-l-2 border-slate-100 last:border-l-transparent">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-600"></div>
                  <h5 className="text-sm font-black text-indigo-600 mb-1">{dir.stage}</h5>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{dir.measure}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <i className="fa-solid fa-circle-exclamation"></i>
          </div>
          <div>
            <h4 className="text-sm font-black text-amber-900 mb-1">{lang === 'EN' ? 'Legal Notice' : 'कानूनी नोटिस'}</h4>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              {lang === 'EN' 
                ? "These guidelines are based on official CPCB (Central Pollution Control Board) standards. Always refer to local government websites for real-time emergency orders during high pollution episodes."
                : "ये दिशा-निर्देश आधिकारिक CPCB (केंद्रीय प्रदूषण नियंत्रण बोर्ड) मानकों पर आधारित हैं। अत्यधिक प्रदूषण के समय वास्तविक समय के आपातकालीन आदेशों के लिए हमेशा स्थानीय सरकारी वेबसाइटों को देखें।"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesTab;

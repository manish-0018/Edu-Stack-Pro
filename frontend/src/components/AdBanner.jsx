import { useState } from 'react';
import { Megaphone, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const ADS = [
  {
    id: 1,
    sponsor: "Campus Bookstore",
    title: "Semester Exam Master Kits 📚",
    description: "15% off reference books, guides, and engineering drawing sheets.",
    code: "EXAMPASS15",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    sponsor: "LeetCode Prep Hub",
    title: "FAANG Prep Mock Kit 🏆",
    description: "Get 25% discount on mock interview sessions and premium company-tagged DSA questions.",
    code: "FAANGPREP25",
    color: "from-amber-600 to-yellow-500",
  },
  {
    id: 3,
    sponsor: "Apex Tech Conclaves",
    title: "National Hackathon Entry Pass 🎟️",
    description: "Waive registration fee for the national 36-hour Smart Campus Hackathon contest.",
    code: "HACKPASS",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: 4,
    sponsor: "PrepInsta Academy",
    title: "TCS & Infosys Prep Bundle 🎯",
    description: "Get 30% off the complete placement preparation package with mock tests.",
    code: "PLACEMENT30",
    color: "from-indigo-600 to-violet-700",
  }
];

const AdBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [claimedIds, setClaimedIds] = useState([]);

  const handleClaim = (ad) => {
    try {
      navigator.clipboard.writeText(ad.code);
      if (!claimedIds.includes(ad.id)) {
        setClaimedIds((prev) => [...prev, ad.id]);
      }
      toast.success(`Coupon code "${ad.code}" copied to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy coupon code.");
    }
  };

  if (!visible) return null;

  const currentAd = ADS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ADS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ADS.length) % ADS.length);
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${currentAd.color} text-white p-5 rounded-3xl shadow-xl border border-white/10 flex flex-col transition-all duration-500`}>
      
      {/* Background decoration */}
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl shrink-0">
            <Megaphone className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-white/30 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Sponsored by {currentAd.sponsor}
              </span>
            </div>
            <h4 className="font-bold text-base mt-1">{currentAd.title}</h4>
            <p className="text-xs text-white/80 mt-0.5 max-w-lg">{currentAd.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end border-t border-white/10 pt-3 md:border-none md:pt-0">
          <div className="px-3 py-1.5 bg-black/20 rounded-lg border border-white/20 font-mono text-xs font-bold tracking-wider">
            Code: <span className="text-yellow-300 font-extrabold">{currentAd.code}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleClaim(currentAd)}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-colors flex items-center gap-1.5 shadow-md ${
                claimedIds.includes(currentAd.id)
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              {claimedIds.includes(currentAd.id) ? 'Claimed ✓' : 'Claim Coupon'} 
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setVisible(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              title="Dismiss ad"
            >
              <X className="w-4 h-4 text-white/60 hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Swipe/Slider Controls */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1">
          {ADS.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-3' : 'bg-white/40 hover:bg-white/60'}`}
              title={`Go to coupon ${idx + 1}`}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="p-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
            title="Previous coupon"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext}
            className="p-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
            title="Next coupon"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdBanner;

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Coffee, BatteryCharging, Brain, Smile, MessageCircle, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOTIVATIONAL_QUOTES = [
  { text: "Consistency beats cramming every single time. One class today makes exam week 10x easier.", author: "Campus Wisdom" },
  { text: "It's completely okay to take breaks—rest isn't giving up, it's recharging.", author: "Student Care" },
  { text: "You don't have to be perfect; you just have to show up.", author: "Daily Motivation" },
  { text: "Small steps every day lead to a stress-free semester end.", author: "Mentor Tip" },
  { text: "Celebrate the small wins: waking up on time, understanding a tough topic, submitting on time.", author: "Positive Mindset" },
];

const VIBES = [
  { id: 'energized', label: 'Energized', icon: BatteryCharging, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40' },
  { id: 'focused', label: 'Focused', icon: Brain, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40' },
  { id: 'taking_it_easy', label: 'Taking it Easy', icon: Coffee, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40' },
  { id: 'stressed', label: 'A Bit Stressed', icon: Heart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40' },
];

const StudentWellnessWidget = ({ studentName = 'friend' }) => {
  const [selectedVibe, setSelectedVibe] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`wellness_vibe_${today}`);
    return saved || null;
  });

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setQuoteIndex(dayOfYear % MOTIVATIONAL_QUOTES.length);
  }, []);

  const handleSelectVibe = (vibeId) => {
    setSelectedVibe(vibeId);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`wellness_vibe_${today}`, vibeId);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 dark:from-dark-card dark:via-dark-card dark:to-indigo-950/20 rounded-2xl p-5 border border-indigo-100/60 dark:border-dark-border shadow-sm mb-6 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left side: Friendly daily check-in */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Student Wellness Corner
            </span>
          </div>
          
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            How are you feeling today, {studentName}?
          </h3>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl italic">
            "{currentQuote.text}" <span className="font-semibold text-gray-400 dark:text-gray-500">— {currentQuote.author}</span>
          </p>
        </div>

        {/* Right side: Vibe Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {VIBES.map((v) => {
            const IconComponent = v.icon;
            const isSelected = selectedVibe === v.id;
            return (
              <button
                key={v.id}
                onClick={() => handleSelectVibe(v.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                  isSelected
                    ? `${v.color} shadow-sm ring-2 ring-primary-500/40 scale-105 font-bold`
                    : 'bg-white dark:bg-dark-bg/60 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/40'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? '' : 'text-gray-400'}`} />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empathetic Supportive Feedback Box based on selected vibe */}
      {selectedVibe && (
        <div className="mt-4 pt-4 border-t border-indigo-100/60 dark:border-dark-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          {selectedVibe === 'stressed' && (
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
              <Heart className="w-4 h-4 text-rose-500 shrink-0" />
              <span>We hear you. College can get intense. Take deep breaths, break your tasks into tiny steps, and remember you don't have to carry it all alone.</span>
            </div>
          )}
          {selectedVibe === 'taking_it_easy' && (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Coffee className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Pacing yourself is smart. Stay hydrated, attend today's classes calmly, and take it one hour at a time.</span>
            </div>
          )}
          {selectedVibe === 'focused' && (
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Brain className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>You're in the zone! Put your phone on silent, tackle your highest-priority topic first, and crush today's sessions.</span>
            </div>
          )}
          {selectedVibe === 'energized' && (
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <BatteryCharging className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Love the energy! Channel that spark into your classes and maybe help a classmate out today.</span>
            </div>
          )}

          {/* Quick Support Links */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <Link
              to="/mentorship"
              className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Talk to Mentor
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link
              to="/study-buddies"
              className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Users className="w-3.5 h-3.5" />
              Study Buddies
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentWellnessWidget;

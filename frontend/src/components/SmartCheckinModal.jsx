import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, MapPin, CheckCircle2, AlertTriangle, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

// Helper: Calculate distance in meters using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const SmartCheckinModal = ({ isOpen, onClose, activeClass, onCheckinSuccess }) => {
  const { user } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [simulateGps, setSimulateGps] = useState(true); // Default to true for ease of testing
  const [distance, setDistance] = useState(0);
  const [studentCoords, setStudentCoords] = useState({ latitude: 0, longitude: 0 });

  const classLat = activeClass?.latitude || 20.3533;
  const classLon = activeClass?.longitude || 85.8266;

  // Sound Feedback
  const playSound = (freq, type = 'sine', duration = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  };

  const verifyLocation = () => {
    if (simulateGps) {
      // Simulate being 12 meters away from class coordinates
      setStudentCoords({
        latitude: classLat + 0.00008,
        longitude: classLon + 0.00008
      });
      setDistance(12);
      setGpsVerified(true);
      setGpsError(false);
      setGpsLoading(false);
      return;
    }

    setGpsLoading(true);
    setGpsError(false);
    setGpsVerified(false);

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setGpsError(true);
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setStudentCoords({ latitude, longitude });
        const dist = getDistance(latitude, longitude, classLat, classLon);
        setDistance(dist);
        setGpsLoading(false);

        if (dist <= 5) {
          setGpsVerified(true);
        } else {
          setGpsVerified(false);
          toast.warning(`Geofence validation failed. You are ${Math.round(dist)}m away from class (limit is 5m).`);
        }
      },
      (err) => {
        console.error("GPS error", err);
        setGpsError(true);
        setGpsLoading(false);
        setGpsVerified(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (isOpen && activeClass) {
      verifyLocation();
    }
  }, [isOpen, simulateGps, activeClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error('Please enter a 4-digit code');
      return;
    }

    if (!gpsVerified) {
      toast.error('You must be within 5m range of the classroom to check-in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`/api/classes/${activeClass.id}/check-in`, {
        otp,
        subjectId: activeClass.subjectId,
        date: new Date().toISOString().split('T')[0],
        latitude: studentCoords.latitude,
        longitude: studentCoords.longitude,
        bypassGps: simulateGps
      });

      playSound(880, 'sine', 0.15); // play success bell
      setTimeout(() => playSound(1318.51, 'sine', 0.25), 120);

      toast.success(res.data.message || 'Checked-in successfully!');
      if (onCheckinSuccess) onCheckinSuccess();
      onClose();
    } catch (err) {
      playSound(220, 'sawtooth', 0.3); // play error buzzer
      toast.error(err.response?.data?.message || 'Check-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-dark-border flex flex-col relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-card">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-teal-500" />
            Classroom Check-In
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center gap-6">
          
          {/* Active Class Box */}
          <div className="w-full bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 p-4 rounded-2xl text-center">
            <div className="text-[10px] uppercase font-black text-teal-600 tracking-wider mb-0.5">Active Session detected</div>
            <h4 className="text-lg font-bold text-gray-800 dark:text-white">{activeClass?.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">Subject: {activeClass?.subjectName || 'Current Lecture'}</p>
          </div>

          {/* Geo-fence Box */}
          <div className="w-full bg-gray-50 dark:bg-dark-bg p-4 rounded-2xl border border-gray-100 dark:border-dark-border/50 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                GEO-FENCE STATUS:
              </span>
              {gpsLoading ? (
                <span className="text-gray-500 font-semibold flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Fetching location...
                </span>
              ) : gpsVerified ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Verified (Classroom)
                </span>
              ) : (
                <span className="text-red-500 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Out of Range
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs border-t border-gray-200/40 dark:border-dark-border/40 pt-2">
              <span className="text-gray-500">Calculated Distance:</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {distance > 1000 ? `${(distance/1000).toFixed(2)} km` : `${Math.round(distance)} meters`}
              </span>
            </div>

            {/* Simulation Toggle */}
            <div className="flex items-center justify-between border-t border-gray-200/40 dark:border-dark-border/40 pt-2 text-xs">
              <span className="text-gray-500 font-medium">🧪 Simulate GPS Proximity</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={simulateGps} 
                  onChange={(e) => setSimulateGps(e.target.checked)} 
                />
                <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>
          </div>

          {/* OTP Code Entry Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6 flex flex-col items-center">
            <div className="space-y-2 text-center">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Enter 4-Digit OTP Code
              </label>
              <p className="text-xs text-gray-400">Type the rotating code displayed on the classroom screen</p>
              
              <div className="flex justify-center mt-3">
                <input
                  type="text"
                  maxLength={4}
                  required
                  pattern="\d{4}"
                  placeholder="••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 4))}
                  className="w-44 text-center tracking-[1.5em] text-3xl font-bold py-3 border-2 border-gray-300 dark:border-dark-border rounded-2xl dark:bg-dark-bg focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-gray-800 dark:text-white transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || gpsLoading || !gpsVerified}
              className={`w-full py-3 text-white rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                loading || gpsLoading || !gpsVerified
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 shadow-teal-500/10'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Submit Code & Check In'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SmartCheckinModal;

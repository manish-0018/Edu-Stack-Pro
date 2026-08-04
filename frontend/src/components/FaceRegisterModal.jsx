import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Camera, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Synthesizer Audio Beep Helper
const playBeep = (freq, type, duration) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq || 440, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + (duration || 0.1));
  } catch (e) {
    console.error(e);
  }
};

const FaceRegisterModal = ({ isOpen, onClose }) => {
  const { user, updateCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('Initializing Face Scanning Engine...');
  const [cameraActive, setCameraActive] = useState(false);
  const [scanState, setScanState] = useState('idle'); // idle, scanning, success, error
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Geolocation states
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [simulateGps, setSimulateGps] = useState(true); // Default to true for ease of testing
  const [distance, setDistance] = useState(0);
  const [classCoords, setClassCoords] = useState({ latitude: 20.3533, longitude: 85.8266 });

  useEffect(() => {
    const fetchClassCoords = async () => {
      if (isOpen && user?.classId) {
        try {
          const res = await axios.get('/api/classes');
          const myClass = res.data.find(c => c.id === user.classId);
          if (myClass) {
            setClassCoords({
              latitude: myClass.latitude || 20.3533,
              longitude: myClass.longitude || 85.8266
            });
          }
        } catch (e) {
          console.error("Failed to load class coordinates", e);
        }
      }
    };
    fetchClassCoords();
  }, [isOpen, user]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // in metres
  };

  const verifyLocation = () => {
    if (simulateGps) {
      setGpsVerified(true);
      setDistance(12); // Simulated inside 50m range (e.g. 12 meters)
      setGpsError(false);
      return;
    }

    setGpsLoading(true);
    setGpsError(false);

    if (!navigator.geolocation) {
      setGpsError(true);
      setGpsLoading(false);
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const dist = calculateDistance(latitude, longitude, classCoords.latitude, classCoords.longitude);
        setDistance(dist);
        
        if (dist <= 100) { // Allowed 100m range for indoor classroom drift
          setGpsVerified(true);
        } else {
          setGpsVerified(false);
          toast.warning(`Too far from class location: ${Math.round(dist)}m away.`);
        }
        setGpsLoading(false);
      },
      (err) => {
        console.error("GPS fetch error", err);
        setGpsError(true);
        setGpsLoading(false);
        setGpsVerified(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Run location verification whenever modal opens, simulation state changes, or class coords load
  useEffect(() => {
    if (isOpen) {
      verifyLocation();
    }
  }, [isOpen, simulateGps, classCoords]);

  // Dynamically load face-api.js from CDN
  useEffect(() => {
    if (!isOpen) return;

    const initFaceApi = async () => {
      try {
        setLoading(true);
        setLoadingMsg('Downloading Face Recognition AI (CDNs)...');

        if (!window.faceapi) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        setLoadingMsg('Loading AI Model weights...');
        const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        
        // Load tinyFaceDetector, landmarks68, and faceRecognition models
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);

        setModelsLoaded(true);
        setLoading(false);
        playBeep(660, 'sine', 0.12);
        setTimeout(() => playBeep(880, 'sine', 0.15), 130);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load Face Recognition AI weights. Ensure you are connected to the internet.');
        onClose();
      }
    };

    initFaceApi();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    if (!gpsVerified) {
      toast.error('Location check failed. You must be on campus to scan.');
      return;
    }
    try {
      setScanState('idle');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      playBeep(440, 'triangle', 0.08);
    } catch (err) {
      console.error(err);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleRegisterFace = async () => {
    if (!videoRef.current || !window.faceapi || !modelsLoaded) return;

    setScanState('scanning');
    playBeep(523.25, 'sine', 0.1); // C5

    let attempts = 0;
    const maxAttempts = 15;

    const processFrame = async () => {
      if (scanState === 'success' || !videoRef.current) return;

      try {
        const detection = await window.faceapi
          .detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          // Play success chime
          playBeep(880, 'sine', 0.15); // A5
          setTimeout(() => playBeep(1318.51, 'sine', 0.25), 120); // E6

          const descriptorArray = Array.from(detection.descriptor);
          
          setScanState('uploading');
          
          const res = await axios.post('/api/users/register-face', {
            faceDescriptor: JSON.stringify(descriptorArray)
          });

          // Update context
          updateCurrentUser({ faceDescriptor: JSON.stringify(descriptorArray) });
          setScanState('success');
          stopCamera();
          toast.success(res.data.message || 'Face template synced successfully!');
          
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            animationFrameRef.current = requestAnimationFrame(processFrame);
          } else {
            setScanState('error');
            playBeep(220, 'sawtooth', 0.3); // Error buzz
            toast.error('Could not detect face. Please align your face inside the circle and try again.');
          }
        }
      } catch (err) {
        console.error(err);
        setScanState('error');
        toast.error('Face scanning processing error');
      }
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-dark-border flex flex-col relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-card">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary-500" />
            Face Identity Registration
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[360px]">
          {loading ? (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">{loadingMsg}</div>
              <p className="text-xs text-gray-400 max-w-[280px] mx-auto">
                First-time initialization requires downloading tiny neural network parameters (~3MB).
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-6">
              
              {/* Geolocation Verification Card */}
              <div className="w-full bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">📍 Geo-Fence Status</span>
                  {gpsLoading ? (
                    <span className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying GPS...
                    </span>
                  ) : gpsVerified ? (
                    <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                      ● Verified (Classroom)
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                      ● Access Blocked
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Calculated Distance:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {distance > 1000 ? `${(distance/1000).toFixed(2)} km` : `${Math.round(distance)} meters`}
                  </span>
                </div>

                {/* Simulation Control Toggle */}
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-dark-border/50 pt-2 text-xs">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">🧪 Simulate GPS Proximity</span>
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
              
              {/* Webcam view */}
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary-500/20 bg-gray-950 flex items-center justify-center shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover scale-x-[-1] ${cameraActive ? 'block' : 'hidden'}`}
                />
                
                {!cameraActive && (
                  <div className="text-center p-4">
                    <Camera className="w-12 h-12 text-gray-600 mx-auto mb-2 opacity-40" />
                    <p className="text-xs text-gray-500">Camera preview inactive</p>
                  </div>
                )}

                {cameraActive && (
                  <>
                    {/* Scanning Circular Cutout Viewfinder */}
                    <div className="absolute inset-0 border-[10px] border-gray-950/80 rounded-full" />
                    
                    {/* Laser Scanner Line Animation */}
                    {scanState === 'scanning' && (
                      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee] animate-[scan_1.5s_ease-in-out_infinite]" 
                        style={{
                          animation: 'scan 1.8s ease-in-out infinite',
                          top: '10%'
                        }}
                      />
                    )}
                  </>
                )}

                {/* State overlays */}
                {scanState === 'uploading' && (
                  <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
                    <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-2" />
                    <span className="text-xs font-bold">Saving face signature...</span>
                  </div>
                )}

                {scanState === 'success' && (
                  <div className="absolute inset-0 bg-emerald-600/90 flex flex-col items-center justify-center text-white p-4 animate-fade-in">
                    <CheckCircle2 className="w-12 h-12 text-white mb-2" />
                    <span className="text-sm font-black">Identity Verified!</span>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="text-center max-w-[320px]">
                {scanState === 'idle' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Align your face within the frame. Ensure good lighting and remove glasses/caps for maximum precision.
                  </p>
                )}
                {scanState === 'scanning' && (
                  <p className="text-xs text-cyan-500 dark:text-cyan-400 font-semibold animate-pulse">
                    Analyzing facial landmarks... Keep your head still.
                  </p>
                )}
                {scanState === 'error' && (
                  <p className="text-xs text-red-500 font-semibold flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Detection failed. Readjust and try again.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full flex gap-3">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    disabled={!gpsVerified}
                    className={`w-full py-2.5 text-white rounded-xl text-xs font-bold transition-all shadow-md ${
                      gpsVerified 
                        ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/10' 
                        : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                    }`}
                  >
                    {!gpsVerified ? '🔒 Unlock via GPS to Start' : 'Start Web Camera'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        stopCamera();
                        setScanState('idle');
                      }}
                      disabled={scanState === 'scanning' || scanState === 'uploading'}
                      className="flex-1 py-2.5 border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-xl text-xs font-bold transition-all"
                    >
                      Turn Off Cam
                    </button>
                    <button
                      onClick={handleRegisterFace}
                      disabled={scanState === 'scanning' || scanState === 'uploading'}
                      className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-500/10 flex items-center justify-center gap-1.5"
                    >
                      {scanState === 'scanning' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Register Face Scan'
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Animation Styles */}
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0.8; }
          50% { top: 90%; opacity: 1; }
          100% { top: 10%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default FaceRegisterModal;

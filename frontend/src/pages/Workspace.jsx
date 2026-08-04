import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Send, Save, MessageSquare, Star, FileText, PenTool, Bot } from 'lucide-react';
import DrawingBoard from '../components/DrawingBoard';
import AITutorPanel from '../components/AITutorPanel';
import { format } from 'date-fns';

const Workspace = () => {
  const { type, id } = useParams(); // type: 'request' (1on1) or 'group'
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // We will store the creatorId here to be robust against page reloads
  const [groupCreatorId, setGroupCreatorId] = useState(location.state?.creatorId || null);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [watchingCount, setWatchingCount] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  
  const [notesData, setNotesData] = useState('');
  const [activeMode, setActiveMode] = useState('notes'); // 'notes' or 'draw'
  const canvasRef = useRef(null);
  
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    // Initial fetch
    fetchMessages();
    if (type === 'group' && !groupCreatorId) {
      fetchGroupDetails();
    }
    
    // Connect to Socket.io
    const newSocket = io(); // Connects to the host (proxied by Vite to backend)
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_session', id);
    });

    newSocket.on('receive_message', (msg) => {
      setMessages(prev => {
        // Prevent duplicates if we already added it locally
        if (prev.find(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    newSocket.on('receive_notes_sync', (syncedNotes) => {
      setNotesData(syncedNotes);
    });
    
    newSocket.on('watching_count', (data) => {
      if (data.sessionId === id) {
        setWatchingCount(data.count);
      }
    });

    // We will handle drawing sync inside DrawingBoard directly or pass socket.
    // For now, Workspace handles Notes and Chat.

    return () => {
      newSocket.disconnect();
    };
  }, [id, type]);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const fetchGroupDetails = async () => {
    try {
      // Fetch all groups and find this one to determine the creator
      const res = await axios.get('/api/collaboration/groups');
      const group = res.data.find(g => g.id === id);
      if (group) setGroupCreatorId(group.creatorId);
    } catch (err) {}
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/collaboration/messages?type=${type}&sessionId=${id}`);
      if (res.data.length > messages.length) {
        setMessages(res.data);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else if (res.data.length !== messages.length) {
        setMessages(res.data);
      }
    } catch (err) {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post('/api/collaboration/messages', { type, sessionId: id, content: newMessage });
      const savedMsg = res.data;
      
      setMessages(prev => [...prev, savedMsg]);
      setNewMessage('');
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      
      if (socket) {
        socket.emit('send_message', { sessionId: id, ...savedMsg });
      }
    } catch (err) {}
  };

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotesData(val);
    if (socket) {
      socket.emit('notes_sync', { sessionId: id, notesData: val });
    }
  };

  const saveSession = async () => {
    try {
      if (activeMode === 'notes') {
        await axios.put(`/api/collaboration/study/${id}/whiteboard`, { text: notesData });
        toast.success('Notes saved successfully!');
      } else {
        const canvas = canvasRef.current;
        if (canvas) {
          const imgData = canvas.toDataURL();
          await axios.put(`/api/collaboration/study/${id}/whiteboard`, { image: imgData });
          toast.success('Drawing saved successfully!');
        }
      }
    } catch (err) {
      toast.error('Failed to save session');
    }
  };

  const submitRating = async () => {
    try {
      await axios.put(`/api/collaboration/study/${id}/rate`, { rating, review });
      toast.success('Thanks for your feedback!');
      navigate('/buddies');
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  const completeSession = async () => {
    try {
      if (type === 'group') {
        let finalNotesData = null;
        if (activeMode === 'notes') {
          finalNotesData = { type: 'text', content: notesData };
        } else {
          const canvas = canvasRef.current;
          if (canvas) finalNotesData = { type: 'image', content: canvas.toDataURL('image/png') };
        }
        await axios.put(`/api/collaboration/groups/${id}/complete`, { notesData: finalNotesData });
        toast.success('Group session ended and notes saved!');
        navigate('/buddies');
      } else {
        await axios.put(`/api/study/${id}/complete`);
        setShowRating(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete session');
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-gray-50 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-800">
      
      {/* Header */}
      <div className="h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/buddies')} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900 dark:text-white leading-tight">Collaborative Workspace</h2>
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {watchingCount} online
              </span>
            </div>
            <p className="text-xs text-gray-500">Session ID: {id.substring(0,8)}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          
          {/* Mode Toggle */}
          <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl flex">
            <button 
              onClick={() => setActiveMode('notes')}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeMode === 'notes' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <FileText className="w-4 h-4" /> Notes
            </button>
            <button 
              onClick={() => setActiveMode('draw')}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeMode === 'draw' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <PenTool className="w-4 h-4" /> Draw
            </button>
          </div>

          {/* Record Session Button */}
          <button 
            onClick={() => {
              if (!user?.isPremium) {
                toast.warning("Whiteboard recording & AI transcripts require a Premium Semester Pass.");
                navigate('/upgrade');
              } else {
                const nextRecordingState = !isRecording;
                setIsRecording(nextRecordingState);
                if (nextRecordingState) {
                  toast.info("Whiteboard & Chat recording started!");
                } else {
                  // Compile chat and notes for AI summarizer
                  const chatTranscript = messages.map(m => `${m.Sender?.name || 'User'}: ${m.content}`).join('\n');
                  const sessionNotes = notesData;
                  const prompt = `Please summarize this whiteboard study session.
Notes/Code:
${sessionNotes || 'No notes taken.'}

Chat Logs:
${chatTranscript || 'No chat messages.'}

Return a clean, detailed study guide summary in bullet points. Explain equations or code highlights.`;

                  toast.info("Compiling study session & creating AI study guide...");
                  axios.post('/api/ai/ask', { prompt, context: 'Whiteboard Study Session Summarizer' })
                    .then(res => {
                      const summary = res.data.response;
                      const title = `AI Study Guide - ${new Date().toLocaleDateString()} (${type === 'group' ? 'Group Study' : '1-on-1 Tutoring'})`;
                      axios.post('/api/collaboration/study-guides', {
                        title,
                        summary,
                        transcript: chatTranscript || 'No chat messages during recording.'
                      }).then(() => {
                        toast.success("Recording saved! AI Study Guide added to Collaboration Hub.");
                      });
                    }).catch(err => {
                      console.error(err);
                      toast.error("Failed to generate AI study guide summary. Please save notes manually.");
                    });
                }
              }
            }}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/10 animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full bg-red-500 ${isRecording ? 'bg-white' : ''}`} />
            {isRecording 
              ? `Recording ${Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:${(recordingSeconds % 60).toString().padStart(2, '0')}` 
              : <span className="flex items-center gap-1.5">Record Session <span className="text-[8px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">👑 Plus</span></span>
            }
          </button>

          <button onClick={saveSession} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Save {activeMode === 'notes' ? 'Notes' : 'Board'}
          </button>
          
          {/* End Session Logic */}
          {(type === 'request' || (type === 'group' && user?.id === groupCreatorId)) && (
            <button onClick={completeSession} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
              End Session
            </button>
          )}

          {/* AI Tutor Toggle */}
          <button 
            onClick={() => setIsAITutorOpen(!isAITutorOpen)} 
            className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl shadow-lg transition-transform transform hover:scale-105"
            title="Ask AI Tutor"
          >
            <Bot className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-dark-border relative">
          
          {/* Notes Mode */}
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-200 ${activeMode === 'notes' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="p-4 border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-slate-800/50 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-gray-900 dark:text-white">Shared Study Notes</h3>
            </div>
            <textarea
              value={notesData}
              onChange={handleNotesChange}
              placeholder="Type your shared notes, study plans, or paste code snippets here... (Don't forget to save!)"
              className="flex-1 w-full p-6 bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200 custom-scrollbar font-mono text-sm leading-relaxed"
            />
          </div>

          {/* Draw Mode */}
          <div className={`absolute inset-0 transition-opacity duration-200 ${activeMode === 'draw' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <DrawingBoard canvasRef={canvasRef} socket={socket} sessionId={id} />
          </div>

        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-white dark:bg-dark-card border-l border-gray-200 dark:border-dark-border flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-slate-800/50 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">Live Chat</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map(msg => {
              const isMine = msg.senderId === user.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-gray-400 mb-1 px-1">{isMine ? 'You' : msg.Sender?.name} • {format(new Date(msg.createdAt), 'h:mm a')}</span>
                  <div className={`px-4 py-2 rounded-2xl max-w-[90%] ${isMine ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-full dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" disabled={!newMessage.trim()} className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-full transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* RATING MODAL (Post-Session) */}
      {showRating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-sm border border-gray-100 dark:border-slate-800 shadow-2xl text-center">
            <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">Session Complete!</h2>
            <p className="text-gray-500 mb-6">How was your study session?</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star)} className={`p-1 transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-slate-700'}`}>
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
            
            <textarea 
              placeholder="Leave a short review (optional)" 
              rows={3} 
              className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 mb-6 outline-none focus:ring-2 focus:ring-indigo-500"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            
            <button onClick={submitRating} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-transform transform hover:-translate-y-0.5">
              Submit & Exit
            </button>
          </div>
        </div>
      )}

      {/* AI Tutor Panel */}
      <AITutorPanel isOpen={isAITutorOpen} onClose={() => setIsAITutorOpen(false)} context={`Workspace Session ${id}`} />
    </div>
  );
};

export default Workspace;

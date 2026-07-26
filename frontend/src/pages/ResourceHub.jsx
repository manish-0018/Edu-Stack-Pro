import { useState, useRef } from 'react';
import { FileText, Download, PenTool, Bot } from 'lucide-react';
import DrawingBoard from '../components/DrawingBoard';
import AITutorPanel from '../components/AITutorPanel';

const ResourceHub = () => {
  const [notes, setNotes] = useState('');
  const [activeMode, setActiveMode] = useState('notes'); // 'notes' or 'draw'
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const canvasRef = useRef(null);

  const saveToComputer = () => {
    if (activeMode === 'notes') {
      if (!notes.trim()) return;
      const blob = new Blob([notes], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'personal-study-notes.md';
      link.click();
    } else {
      const canvas = canvasRef.current;
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = 'personal-drawing.png';
        link.click();
      }
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-gray-50 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-800">
      
      {/* Header */}
      <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-4 py-4 md:px-8 md:py-0 md:h-20 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" /> Personal Notes & Scratchpad
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-0">Draft study guides, write code snippets, or organize your thoughts.</p>
        </div>
        <div className="flex gap-4 items-center w-full md:w-auto">
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
          <button onClick={saveToComputer} className="w-full md:w-auto px-5 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Save to PC
          </button>
          
          {/* AI Tutor Toggle */}
          <button 
            onClick={() => setIsAITutorOpen(!isAITutorOpen)} 
            className="p-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl shadow-lg transition-transform transform hover:scale-105"
            title="Ask AI Tutor"
          >
            <Bot className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 relative w-full">
        {/* Notes Mode */}
        <div className={`absolute inset-0 flex flex-col bg-white dark:bg-slate-900 transition-opacity duration-200 ${activeMode === 'notes' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="# Study Notes&#10;&#10;Start typing here... (You can write Markdown or paste code blocks!)"
            className="flex-1 w-full p-8 bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200 custom-scrollbar font-mono text-base leading-relaxed"
          />
        </div>

        {/* Draw Mode */}
        <div className={`absolute inset-0 bg-white transition-opacity duration-200 ${activeMode === 'draw' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <DrawingBoard canvasRef={canvasRef} />
        </div>
      </div>

      {/* AI Tutor Panel */}
      <AITutorPanel isOpen={isAITutorOpen} onClose={() => setIsAITutorOpen(false)} context={`User Scratchpad`} />
    </div>
  );
};

export default ResourceHub;


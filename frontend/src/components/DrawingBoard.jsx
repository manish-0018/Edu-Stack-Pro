import { useState, useEffect, useRef } from 'react';
import { Trash2, Eraser, Pen, Palette } from 'lucide-react';

const DrawingBoard = ({ canvasRef, socket, sessionId }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  
  const lastPos = useRef(null);

  // Colors
  const presetColors = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'];

  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const parent = canvas.parentElement;
      const rect = parent.getBoundingClientRect();
      
      // Only set width/height if not already set or window resized
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        // Save old content if any
        let oldImg = null;
        if (canvas.width > 0) {
          oldImg = canvas.toDataURL();
        }

        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Restore old content
        if (oldImg) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0);
          img.src = oldImg;
        }
      }
    };

    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [canvasRef]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;
    
    socket.on('receive_canvas_stroke', (stroke) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      ctx.beginPath();
      ctx.moveTo(stroke.x0, stroke.y0);
      ctx.lineTo(stroke.x1, stroke.y1);
      
      if (stroke.isEraser) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = stroke.size * 5;
      } else {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
      }
      
      ctx.stroke();
    });

    socket.on('receive_canvas_clear', () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    
    // Fallback sync full image
    socket.on('receive_canvas_sync', (imgData) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = imgData;
    });

    return () => {
      socket.off('receive_canvas_stroke');
      socket.off('receive_canvas_clear');
      socket.off('receive_canvas_sync');
    };
  }, [socket, canvasRef]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    lastPos.current = { x, y };
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (isEraser) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 5;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();

    // Emit stroke
    if (socket && lastPos.current) {
      socket.emit('canvas_stroke', {
        sessionId,
        x0: lastPos.current.x,
        y0: lastPos.current.y,
        x1: x,
        y1: y,
        color,
        size: brushSize,
        isEraser
      });
    }

    lastPos.current = { x, y };
  };

  const stopDrawing = () => {
    if (isDrawing && socket) {
      // At the end of a drawing stroke, we can emit a full sync occasionally to prevent drift, or just trust the strokes
    }
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (socket) {
      socket.emit('canvas_clear', { sessionId });
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full bg-white">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-2xl z-10 flex items-center gap-4">
        
        {/* Tools */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-slate-700 pr-4">
          <button 
            onClick={() => setIsEraser(false)} 
            className={`p-2 rounded-xl transition-colors ${!isEraser ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            title="Pen"
          >
            <Pen className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsEraser(true)} 
            className={`p-2 rounded-xl transition-colors ${isEraser ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>
        </div>

        {/* Colors (only show if not erasing) */}
        {!isEraser && (
          <div className="flex items-center gap-2 border-r border-gray-200 dark:border-slate-700 pr-4">
            <Palette className="w-4 h-4 text-gray-400" />
            {presetColors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        {/* Size */}
        <div className="flex items-center gap-2 border-r border-gray-200 dark:border-slate-700 pr-4">
          <span className="text-xs font-bold text-gray-400">SIZE</span>
          <input 
            type="range" 
            min="1" max="20" 
            value={brushSize} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20 accent-indigo-600"
          />
        </div>

        {/* Clear */}
        <button 
          onClick={clearBoard} 
          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          title="Clear Board"
        >
          <Trash2 className="w-5 h-5" />
        </button>

      </div>

      {/* Canvas */}
      <div 
        className="flex-1 w-full h-full relative overflow-hidden bg-white rounded-b-2xl md:rounded-bl-none" 
        style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>') 12 12, crosshair` }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 touch-none w-full h-full"
          style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>') 12 12, crosshair` }}
        />
      </div>
    </div>
  );
};

export default DrawingBoard;

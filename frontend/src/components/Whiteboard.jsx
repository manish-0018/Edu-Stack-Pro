import React, { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Eraser, Pen, Trash2 } from 'lucide-react';

const Whiteboard = ({ sessionId }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join_session', sessionId);

    newSocket.on('draw', (data) => {
      drawOnCanvas(data.x0, data.y0, data.x1, data.y1, data.color, data.size, false);
    });

    newSocket.on('clear_board', () => {
      clearCanvas(false);
    });

    return () => newSocket.close();
  }, [sessionId]);

  const drawOnCanvas = (x0, y0, x1, y1, color, size, emit) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();

    if (!emit || !socket) return;
    
    socket.emit('draw', {
      sessionId,
      x0, y0, x1, y1, color, size
    });
  };

  const clearCanvas = (emit = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (emit && socket) {
      socket.emit('clear_board', sessionId);
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    return { x, y };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    canvasRef.current.lastX = x;
    canvasRef.current.lastY = y;
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const lastX = canvasRef.current.lastX;
    const lastY = canvasRef.current.lastY;

    drawOnCanvas(lastX, lastY, x, y, color, brushSize, true);

    canvasRef.current.lastX = x;
    canvasRef.current.lastY = y;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
      <div className="bg-gray-800 p-3 flex gap-4 items-center border-b border-gray-700">
        <input 
          type="color" 
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
        />
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-32 accent-primary-500"
        />
        <button 
          onClick={() => setColor('#111827')} 
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title="Eraser"
        >
          <Eraser className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setColor('#ffffff')} 
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title="Pen"
        >
          <Pen className="w-5 h-5" />
        </button>
        <div className="flex-grow"></div>
        <button 
          onClick={() => clearCanvas(true)}
          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-900/30 rounded-lg transition-colors"
          title="Clear Board"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-grow relative overflow-hidden bg-gray-900 touch-none">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
};

export default Whiteboard;

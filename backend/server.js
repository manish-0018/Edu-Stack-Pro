const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
const notesDir = path.join(uploadsDir, 'notes');
if (!fs.existsSync(notesDir)) fs.mkdirSync(notesDir);

// Load env vars
dotenv.config();

// Initialize Database connection
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT']
  }
});
app.set('io', io);

// WebSockets Logic
io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);

  socket.on('join_session', (sessionId) => {
    socket.join(sessionId);
    socket.sessionId = sessionId;
    console.log(`User ${socket.id} joined session ${sessionId}`);
    
    // Broadcast updated headcount to all clients in the room
    const roomSize = io.sockets.adapter.rooms.get(sessionId)?.size || 0;
    io.to(sessionId).emit('watching_count', { sessionId, count: roomSize });
  });

  // Handle new chat messages
  socket.on('send_message', (data) => {
    // data: { sessionId, ...messageDetails }
    // Broadcast to everyone in the room except the sender
    socket.to(data.sessionId).emit('receive_message', data);
  });

  // Handle Drawing Board sync
  socket.on('canvas_sync', (data) => {
    socket.to(data.sessionId).emit('receive_canvas_sync', data.image);
  });

  socket.on('canvas_stroke', (data) => {
    socket.to(data.sessionId).emit('receive_canvas_stroke', data);
  });

  socket.on('canvas_clear', (data) => {
    socket.to(data.sessionId).emit('receive_canvas_clear');
  });

  // Handle new chat messages
  socket.on('send_message', (data) => {
    io.to(data.sessionId).emit('receive_message', data);
  });

  // Handle Notes Text sync
  socket.on('notes_sync', (data) => {
    socket.to(data.sessionId).emit('receive_notes_sync', data.notesData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.sessionId) {
      const roomSize = io.sockets.adapter.rooms.get(socket.sessionId)?.size || 0;
      io.to(socket.sessionId).emit('watching_count', { sessionId: socket.sessionId, count: roomSize });
    }
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/marks', require('./routes/markRoutes'));
app.use('/api/recovery', require('./routes/recoveryRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/grades', require('./routes/gradeRoutes'));
app.use('/api/placements', require('./routes/placementRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/mentorship', require('./routes/mentorshipRoutes'));
app.use('/api/opportunities', require('./routes/opportunityRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/study', require('./routes/studyRoutes'));
app.use('/api/collaboration', require('./routes/collaborationRoutes'));
app.use('/api/warnings', require('./routes/warningRoutes'));
app.use('/api/economy', require('./routes/economyRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/confessions', require('./routes/confessionRoutes'));
app.use('/api/marketplace', require('./routes/marketplaceRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/placementinsights', require('./routes/placementInsightRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

// Serve Frontend static assets
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.accepts('html') && !req.path.startsWith('/api')) {
      res.sendFile(path.resolve(frontendDist, 'index.html'));
    } else {
      next();
    }
  });
}

// Error Middleware
app.use(errorHandler);

// Determine a free port (starting from env PORT or 5000)
const getFreePort = async (start) => {
  const net = require('net');
  let port = start;
  while (true) {
    const tester = net.createServer();
    try {
      await new Promise((resolve, reject) => {
        tester.once('error', reject);
        tester.once('listening', () => {
          tester.close(() => resolve(port));
        });
        tester.listen(port);
      });
      return port;
    } catch (e) {
      if (e.code === 'EADDRINUSE') {
        port++;
      } else {
        throw e;
      }
    }
  }
};

(async () => {
  try {
    await sequelize.sync({ alter: true }); // DB Sync Reload
    console.log('Sequelize Models Synced to PostgreSQL DB');
    const startPort = process.env.PORT ? parseInt(process.env.PORT) : 5000;
    const freePort = await getFreePort(startPort);
    server.listen(freePort, () => {
      console.log(`Server & WebSockets running on port ${freePort}`);
    });
  } catch (err) {
    console.error('Error syncing Sequelize models or starting server:', err);
  }
})();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import clubRoutes from './routes/clubs.js';
import categoryRoutes from './routes/categories.js';
import ideaRoutes from './routes/ideas.js';
import statsRoutes from './routes/stats.js';
import searchRoutes from './routes/search.js';
import notificationRoutes from './routes/notifications.js';
import messageRoutes from './routes/messages.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, '../..', 'frontend', 'dist');

const app = express();
const httpServer = createServer(app);

const rawClientUrls = process.env.CLIENT_URL || process.env.CLIENT_URLS || '';
const allowedOrigins = rawClientUrls
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
};

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

app.use(cors(corsOptions));
app.use(express.json());

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

if (fs.existsSync(frontendDistPath)) {
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

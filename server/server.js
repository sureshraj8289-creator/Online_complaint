import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Database Connection
connectDB();

// Core Security & Middleware
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'Complaint Management & Transparency System API',
    timestamp: new Date(),
  });
});

// Error Handling Middleware
app.use(errorHandler);

// ── Local dev: start HTTP server ──────────────────────────────────────────────
// In Vercel serverless, this block is skipped; the app is exported below.
if (process.env.NODE_ENV !== 'production' || process.env.LOCAL_DEV === 'true') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[Server] Complaint Management Server running on port ${PORT}`);
  });
}

// ── Vercel serverless export ──────────────────────────────────────────────────
export default app;

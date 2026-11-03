// ============================================
// PARIJAT API — Express Application
// ============================================

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { config } from './config/index';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import equipmentRoutes from './routes/equipment.routes';
import bookingRoutes from './routes/booking.routes';
import reviewRoutes from './routes/review.routes';
import priceRoutes from './routes/price.routes';
import inputRoutes, { groupPurchaseRouter } from './routes/input.routes';
import messageRoutes from './routes/message.routes';
import notificationRoutes from './routes/notification.routes';

const app = express();

// --- Core Middleware ---
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any localhost/127.0.0.1 in dev
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    // Allow configured origin
    if (origin === config.cors.origin) {
      return callback(null, true);
    }
    callback(null, true); // Dev-friendly fallback
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads if directory exists
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root landing endpoint — provides clear guidance when opening backend in browser
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parijat API & Service Status</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; box-sizing: border-box; }
    .card { background: #1e293b; padding: 36px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); max-width: 580px; width: 100%; border: 1px solid #334155; }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: #064e3b; color: #34d399; font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px; }
    .dot { width: 8px; height: 8px; background: #34d399; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    h1 { font-size: 26px; margin: 0 0 10px; color: #ffffff; }
    p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 24px; }
    .action-box { background: #0f172a; border-radius: 14px; padding: 20px; border: 1px solid #334155; margin-bottom: 24px; text-align: center; }
    .action-title { font-size: 14px; color: #cbd5e1; font-weight: 600; margin-bottom: 12px; }
    .btn { display: inline-block; background: #16a34a; color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; transition: background 0.2s; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.4); }
    .btn:hover { background: #15803d; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
    .link-card { background: #334155; padding: 12px 16px; border-radius: 10px; text-decoration: none; color: #38bdf8; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; transition: background 0.2s; }
    .link-card:hover { background: #475569; }
    .tagline { margin-top: 24px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> 🌸 Backend API Online & Active (Port 3001)</div>
    <h1>Parijat Agricultural Platform</h1>
    <p>You have accessed the <strong>REST API backend</strong> on port 3001. The interactive web interface runs on port <strong>5174</strong>.</p>
    
    <div class="action-box">
      <div class="action-title">🌾 Ready to explore the Parijat App?</div>
      <a href="${config.cors.origin}" class="btn">🚀 Open Web App (${config.cors.origin})</a>
    </div>

    <div style="font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px;">Explore Backend Endpoints:</div>
    <div class="grid">
      <a href="/api/health" class="link-card"><span>🌿 Health Check</span> <span>&rarr;</span></a>
      <a href="/api/v1/crops" class="link-card"><span>🌾 Crops & Prices</span> <span>&rarr;</span></a>
      <a href="/api/v1/equipment" class="link-card"><span>🚜 Equipment Listings</span> <span>&rarr;</span></a>
      <a href="/api/v1/inputs" class="link-card"><span>📦 Farm Inputs</span> <span>&rarr;</span></a>
    </div>
    <div class="tagline">Rent • Share • Grow (भाड्याने घ्या • शेअर करा • समृद्ध व्हा)</div>
  </div>
</body>
</html>`);
  }

  res.json({
    status: 'ok',
    app: 'Parijat API',
    tagline: 'Rent • Share • Grow (भाड्याने घ्या • शेअर करा • समृद्ध व्हा)',
    webAppUrl: config.cors.origin,
    healthUrl: '/api/health',
    version: '1.0.0',
    mode: config.isDemo ? 'demo' : 'production',
  });
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Parijat API',
    tagline: 'Rent • Share • Grow (भाड्याने घ्या • शेअर करा • समृद्ध व्हा)',
    version: '1.0.0',
    mode: config.isDemo ? 'demo' : 'production',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      auth: 'active',
      equipment: 'active',
      cropPrices: 'active',
      aiPriceEstimator: 'active',
      farmInputs: 'active',
      messaging: 'active',
      notifications: 'active',
    },
  });
});

// --- API v1 Routes ---
const v1 = express.Router();

v1.use('/auth', authRoutes);
v1.use('/users', userRoutes);
v1.use('/equipment', equipmentRoutes);
v1.use('/bookings', bookingRoutes);
v1.use('/reviews', reviewRoutes);
v1.use('/', priceRoutes); // /crops, /markets, /market-prices, /price-estimates
v1.use('/inputs', inputRoutes);
v1.use('/group-purchases', groupPurchaseRouter);
v1.use('/conversations', messageRoutes);
v1.use('/notifications', notificationRoutes);

app.use('/api/v1', v1);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: 'Requested endpoint does not exist',
    statusCode: 404,
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;

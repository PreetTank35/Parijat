// ============================================
// PARIJAT API — Server Entry Point
// ============================================

import app from './app';
import { config } from './config/index';
import prisma from './db/index';

const PORT = config.port || 3001;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('[DATABASE] Connected to database successfully.');

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🌸 PARIJAT API SERVER STARTED`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌿 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌱 API Base: http://localhost:${PORT}/api/v1`);
      console.log(`Mode: ${config.nodeEnv} | Demo: ${config.isDemo}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('[DATABASE] Database connection warning:', (error as Error).message);
    // Still start server so API health and mocks can respond or wait for DB
    app.listen(PORT, () => {
      console.log(`🌸 PARIJAT API running on http://localhost:${PORT} (DB offline/pending)`);
    });
  }
}

startServer();

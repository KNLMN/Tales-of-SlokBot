// Load environment variables FIRST - before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import characterRoutes from './routes/character.routes';
import classRoutes from './routes/class.routes';
import abilityRoutes from './routes/ability.routes';
import inventoryRoutes from './routes/inventory.routes';
import questRoutes from './routes/quest.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import slokjesRoutes from './routes/slokjes.routes';
import combatRoutes from './routes/combat.routes';
import { initTelegramBot } from './telegram/bot';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Tales of SlokBot API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/abilities', abilityRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/slokjes', slokjesRoutes);
app.use('/api/combat', combatRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize Telegram Bot
if (process.env.TELEGRAM_BOT_TOKEN) {
  initTelegramBot();
  console.log('✅ Telegram bot initialized');
} else {
  console.warn('⚠️  Telegram bot token not found - bot disabled');
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🎮 Tales of SlokBot API ready!`);
});

export default app;
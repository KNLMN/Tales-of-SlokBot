import { Router } from 'express';
import { startPvECombat, getCombatHistory } from '../controllers/combat.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Start PvE combat
router.post('/pve', startPvECombat);

// Get combat history
router.get('/history', getCombatHistory);

export default router;

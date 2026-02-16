import { Router } from 'express';
import { supabaseAdmin } from '../utils/supabase';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/xp', asyncHandler(async (req, res) => {
  const { data } = await supabaseAdmin
    .from('leaderboard_xp')
    .select('*')
    .limit(100);
  
  res.json({ success: true, data: data || [] });
}));

router.get('/slokjes', asyncHandler(async (req, res) => {
  const { data } = await supabaseAdmin
    .from('leaderboard_slokjes')
    .select('*')
    .limit(100);
  
  res.json({ success: true, data: data || [] });
}));

export default router;

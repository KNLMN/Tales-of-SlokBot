import { Request, Response } from 'express';
import { supabaseAdmin } from '../utils/supabase';
import { AppError } from '../middleware/errorHandler';

export const getAbilitiesByClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { classId } = req.params;

  const { data: abilities, error } = await supabaseAdmin
    .from('abilities')
    .select('*')
    .eq('class_id', classId)
    .order('level_required');

  if (error) {
    throw new AppError('Failed to fetch abilities', 500);
  }

  res.json({
    success: true,
    data: abilities
  });
};

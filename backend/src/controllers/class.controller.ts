import { Request, Response } from 'express';
import { supabaseAdmin } from '../utils/supabase';
import { AppError } from '../middleware/errorHandler';

export const getAllClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { data: classes, error } = await supabaseAdmin
    .from('classes')
    .select('*')
    .order('id');

  if (error) {
    throw new AppError('Failed to fetch classes', 500);
  }

  res.json({
    success: true,
    data: classes
  });
};

export const getClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const { data: classData, error } = await supabaseAdmin
    .from('classes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !classData) {
    throw new AppError('Class not found', 404);
  }

  res.json({
    success: true,
    data: classData
  });
};

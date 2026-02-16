import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase, supabaseAdmin } from '../utils/supabase';
import { AppError } from '../middleware/errorHandler';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, telegram_username }: RegisterRequest = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) {
    throw new AppError(authError.message, 400);
  }

  if (!authData.user) {
    throw new AppError('Failed to create user', 500);
  }

  const { error: userError } = await supabaseAdmin
    .from('users')
    .insert({
      id: authData.user.id,
      telegram_username: telegram_username || null,
      slokjes_given: 0,
      slokjes_received: 0
    });

  if (userError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw new AppError('Failed to create user profile', 500);
  }

  const token = jwt.sign(
  { userId: authData.user.id, email: authData.user.email },
  String(JWT_SECRET),
  { expiresIn: String(JWT_EXPIRES_IN) }
);

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  const response: AuthResponse = {
    user: user!,
    token
  };

  res.status(201).json({
    success: true,
    data: response,
    message: 'Registration successful'
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginRequest = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError || !authData.user) {
    throw new AppError('Invalid email or password', 401);
  }

  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (userError || !user) {
    throw new AppError('User profile not found', 404);
  }

  const { data: character } = await supabaseAdmin
    .from('characters')
    .select(`
      *,
      class:classes(*)
    `)
    .eq('user_id', authData.user.id)
    .single();

  if (character) {
    await supabaseAdmin
      .from('characters')
      .update({ last_login: new Date().toISOString() })
      .eq('id', character.id);
  }

  const token = jwt.sign(
  { userId: authData.user.id, email: authData.user.email },
  String(JWT_SECRET),
  { expiresIn: String(JWT_EXPIRES_IN) }
);

  const response: AuthResponse = {
    user,
    token,
    character: character || undefined
  };

  res.json({
    success: true,
    data: response,
    message: 'Login successful'
  });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401);
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', decoded.userId)
    .single();

  if (userError || !user) {
    throw new AppError('User not found', 404);
  }

  const { data: character } = await supabaseAdmin
    .from('characters')
    .select(`
      *,
      class:classes(*)
    `)
    .eq('user_id', decoded.userId)
    .single();

  res.json({
    success: true,
    data: {
      user,
      character: character || null
    }
  });
};
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    console.log('🔍 Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided'
      });
      return;
    }

    const token = authHeader.substring(7);
    console.log('🔍 Token received (first 20 chars):', token.substring(0, 20));
    console.log('🔍 JWT_SECRET (first 5 chars):', JWT_SECRET.substring(0, 5));

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email?: string };
    console.log('✅ Token decoded:', decoded);

    // Verify user exists in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      console.log('❌ User not found in DB:', decoded.userId);
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
      return;
    }

    console.log('✅ User verified:', user.id);

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.log('❌ Token verification error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  await authenticate(req, res, next);
};
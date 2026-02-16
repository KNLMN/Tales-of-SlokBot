import { Router } from 'express';
import {
  createCharacter,
  getMyCharacter,
  getCharacter,
  deleteCharacter,
  getCharacterAbilities
} from '../controllers/character.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/characters
 * @desc    Create a new character
 * @access  Private
 */
router.post('/', authenticate, asyncHandler(createCharacter));

/**
 * @route   GET /api/characters/me
 * @desc    Get current user's character
 * @access  Private
 */
router.get('/me', authenticate, asyncHandler(getMyCharacter));

/**
 * @route   GET /api/characters/me/abilities
 * @desc    Get current character's abilities
 * @access  Private
 */
router.get('/me/abilities', authenticate, asyncHandler(getCharacterAbilities));

/**
 * @route   GET /api/characters/:id
 * @desc    Get character by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(getCharacter));

/**
 * @route   DELETE /api/characters/me
 * @desc    Delete current user's character
 * @access  Private
 */
router.delete('/me', authenticate, asyncHandler(deleteCharacter));

export default router;

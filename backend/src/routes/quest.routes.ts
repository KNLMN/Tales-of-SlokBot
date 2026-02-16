import { Router } from 'express';
import {
  getAvailableQuests,
  getMyQuests,
  startQuest,
  completeQuest
} from '../controllers/quest.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   GET /api/quests
 * @desc    Get available quests for character level
 * @access  Private
 */
router.get('/', authenticate, asyncHandler(getAvailableQuests));

/**
 * @route   GET /api/quests/my-quests
 * @desc    Get character's active/completed quests
 * @access  Private
 */
router.get('/my-quests', authenticate, asyncHandler(getMyQuests));

/**
 * @route   POST /api/quests/:id/start
 * @desc    Start a quest
 * @access  Private
 */
router.post('/:id/start', authenticate, asyncHandler(startQuest));

/**
 * @route   POST /api/quests/:id/complete
 * @desc    Complete quest (auto-battle)
 * @access  Private
 */
router.post('/:id/complete', authenticate, asyncHandler(completeQuest));

export default router;
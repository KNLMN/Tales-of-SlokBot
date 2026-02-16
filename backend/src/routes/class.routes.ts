import { Router } from 'express';
import { getAllClasses, getClass } from '../controllers/class.controller';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   GET /api/classes
 * @desc    Get all classes
 * @access  Public
 */
router.get('/', asyncHandler(getAllClasses));

/**
 * @route   GET /api/classes/:id
 * @desc    Get class by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(getClass));

export default router;

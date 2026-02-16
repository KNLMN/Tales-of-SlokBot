import { Router } from 'express';
import { getAbilitiesByClass, grantMyAbilities } from '../controllers/ability.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/class/:classId', asyncHandler(getAbilitiesByClass));

// Grant abilities to authenticated user's character
router.post('/grant-mine', authenticate, asyncHandler(grantMyAbilities));

export default router;

import { Router } from 'express';
import { getAbilitiesByClass } from '../controllers/ability.controller';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/class/:classId', asyncHandler(getAbilitiesByClass));

export default router;

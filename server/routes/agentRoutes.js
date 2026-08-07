import express from 'express';
import { getAgents, assignAgent } from '../controllers/agentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('ADMIN', 'AGENT'), getAgents);
router.patch('/assign', authorize('ADMIN'), assignAgent);

export default router;

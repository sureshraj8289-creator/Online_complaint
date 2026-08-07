import express from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:complaintId', getMessages);
router.post('/:complaintId', sendMessage);

export default router;

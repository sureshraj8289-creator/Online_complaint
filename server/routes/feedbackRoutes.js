import express from 'express';
import { body } from 'express-validator';
import { submitFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('complaintId').notEmpty().withMessage('Complaint ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    validateRequest,
  ],
  submitFeedback
);

router.get('/', authorize('ADMIN', 'AGENT'), getAllFeedback);

export default router;

import express from 'express';
import { body } from 'express-validator';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    validateRequest,
  ],
  createComplaint
);

router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.patch('/:id/status', authorize('AGENT', 'ADMIN'), updateComplaintStatus);
router.delete('/:id', authorize('ADMIN'), deleteComplaint);

export default router;

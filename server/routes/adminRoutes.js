import express from 'express';
import { getAdminStats, getAllUsers, updateUserRole } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);

export default router;

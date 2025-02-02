import express from 'express';
import {
  createHoliday,
  getAllHolidays,
  getHolidayById,
  updateHoliday,
  deleteHoliday
} from '../controllers/holiday.controller.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

// authenticateUser routes (require authentication)
router.use(authenticateUser);

router.get('/', getAllHolidays);
router.get('/:id', getHolidayById);


// Teacher-only routes
router.use(authorizeRoles('Teacher'));

router.post('/', createHoliday);
router.put('/:id', updateHoliday);
router.delete('/:id', deleteHoliday);

export default router;
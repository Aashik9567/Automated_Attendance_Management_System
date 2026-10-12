import express from 'express';
import {
  createHoliday,
  getAllHolidays,
  getHolidayById,
  updateHoliday,
  deleteHoliday
} from '../controllers/holiday.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/roleCheck.middleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', getAllHolidays);
router.get('/:id', getHolidayById);

// Teacher-only routes
router.use(restrictTo('Teacher'));

router.post('/', createHoliday);
router.put('/:id', updateHoliday);
router.delete('/:id', deleteHoliday);

export default router;

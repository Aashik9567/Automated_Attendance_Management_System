import express from 'express';
import { markAttendance } from '../controllers/attendance.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/markattendance").post(authenticateUser, markAttendance);

export default router;
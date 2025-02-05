
import express from 'express';
import { 
    markAttendance,
    getAttendanceBySubject,
    updateAttendance,
    deleteAttendance,
    getStudentAttendance
} from '../controllers/attendance.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/markattendance")
    .post(authenticateUser, markAttendance);

router.route("/subject/:subjectId")
    .get(authenticateUser, getAttendanceBySubject);

router.route("/update/:attendanceId")
    .put(authenticateUser, updateAttendance);

router.route("/delete/:attendanceId")
    .delete(authenticateUser, deleteAttendance);
router.route("/student")
    .get(authenticateUser, getStudentAttendance);    


export default router;

import express from 'express';
import { 
    markAttendance,
    getAttendanceBySubject,
    getAttendanceByStudent,
    updateAttendance,
    deleteAttendance,
    getStudentAttendanceBySubject
} from '../controllers/attendance.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/markattendance")
    .post(authenticateUser, markAttendance);

router.route("/subject/:subjectId")
    .get(authenticateUser, getAttendanceBySubject);

router.route("/student/:studentId")
    .get(authenticateUser, getAttendanceByStudent);

router.route("/update/:attendanceId")
    .put(authenticateUser, updateAttendance);

router.route("/delete/:attendanceId")
    .delete(authenticateUser, deleteAttendance);

router.route("/student/:studentId/subject/:subjectId")
    .get(authenticateUser, getStudentAttendanceBySubject);

export default router;
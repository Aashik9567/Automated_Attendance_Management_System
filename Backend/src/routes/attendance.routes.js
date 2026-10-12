import express from 'express';
import {
    markAttendance,
    getAttendanceBySubject,
    deleteAttendance,
    getStudentAttendance,
    recognizeAttendancePhoto
} from '../controllers/attendance.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/roleCheck.middleware.js';
import { imageUpload } from '../middlewares/fileUpload.middleware.js';

const router = express.Router();
router.use(authenticateUser);

// Teachers record and read attendance for their own subjects.
router.post("/markattendance", restrictTo('Teacher'), markAttendance);
router.post("/recognize", restrictTo('Teacher'), imageUpload.single('file'), recognizeAttendancePhoto);
router.get("/subject/:subjectId", restrictTo('Teacher'), getAttendanceBySubject);
router.delete("/delete/:attendanceId", restrictTo('Teacher'), deleteAttendance);

// Students read their own attendance.
router.get("/student", restrictTo('Student'), getStudentAttendance);

export default router;

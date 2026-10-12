import { Attendance } from '../models/attendance.model.js';
import { findOwnedSubject } from '../utils/findOwnedSubject.js';
import asyncHandler from '../utils/asyncHandler.js';
import { apiError } from '../utils/errorHandler.js';
import { recognizeFaces } from '../services/faceService.js';

// A student's own records: each session carries only that student's entry,
// never their classmates'.
export const getStudentAttendance = asyncHandler(async (req, res) => {
    const attendance = await Attendance.find(
        { 'students.student': req.user._id },
        { subject: 1, date: 1, teacher: 1, createdAt: 1, students: { $elemMatch: { student: req.user._id } } }
    ).populate('subject', 'name');
    res.status(200).json(attendance);
});

// Mark attendance for a class
export const markAttendance = asyncHandler(async (req, res) => {
    const { subjectId, students, date } = req.body;
    if (!subjectId || !Array.isArray(students) || students.length === 0) {
        throw new apiError(400, 'Invalid attendance data');
    }
    await findOwnedSubject(subjectId, req.user);

    // One session per subject per day. (Compare the whole day: stored
    // dates include a time, so an exact-midnight match never fires.)
    const day = date ? new Date(date) : new Date();
    if (Number.isNaN(day.getTime())) throw new apiError(400, 'Invalid date');
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    if (await Attendance.exists({ subject: subjectId, date: { $gte: dayStart, $lte: dayEnd } })) {
        throw new apiError(409, 'Attendance already marked for this date');
    }

    const attendance = await Attendance.create({
        subject: subjectId,
        students: students.map((s) => ({ student: s.student, status: s.status })),
        teacher: req.user._id,
        date: day,
    });
    res.status(201).json(attendance);
});

// Recognize students in a class photo via the face service.
export const recognizeAttendancePhoto = asyncHandler(async (req, res) => {
    if (!req.file) throw new apiError(400, 'Please attach a class photo');
    const result = await recognizeFaces(req.file);
    res.status(200).json(result);
});

// Get attendance by subject (the subject's teacher only)
export const getAttendanceBySubject = asyncHandler(async (req, res) => {
    await findOwnedSubject(req.params.subjectId, req.user);
    const attendanceRecords = await Attendance.find({ subject: req.params.subjectId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: attendanceRecords });
});

// Delete attendance record
export const deleteAttendance = asyncHandler(async (req, res) => {
    const attendance = await Attendance.findById(req.params.attendanceId);
    if (!attendance) throw new apiError(404, 'Attendance record not found');
    await findOwnedSubject(attendance.subject, req.user);
    await attendance.deleteOne();
    res.status(200).json({ success: true, message: 'Attendance record deleted successfully' });
});

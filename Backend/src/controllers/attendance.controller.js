import { Attendance } from '../models/attendance.model.js';
import { StudentSubject } from '../models/studentSubject.model.js';
import { Subject } from '../models/subject.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getStudentAttendance = asyncHandler(async (req, res) => {
    try {
      const attendance = await Attendance.find({
        'students.student': req.user._id
      }).populate('subject', 'name');
      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Mark attendance for a class
export const markAttendance = async (req, res) => {
    try {
        const { subjectId, students, date } = req.body;

        if (!subjectId || !students || students.length === 0) {
            return res.status(400).json({ message: 'Invalid attendance data' });
        }

        // Check for existing attendance on the same date and subject
        const existingAttendance = await Attendance.findOne({
            subject: subjectId,
            date: new Date(date).setHours(0, 0, 0, 0)
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for this date' });
        }

        const attendance = new Attendance({
            subject: subjectId,
            students: students.map(s => ({
                student: s.student,
                status: s.status,
                confidence: s.confidence || null
            })),
            teacher: req.user._id,
            date: date || new Date()
        });

        await attendance.save();

        // Update StudentSubject attendance records
        const bulkOps = students.map(student => ({
            updateOne: {
                filter: {
                    student: student.student,
                    subject: subjectId
                },
                update: {
                    $inc: {
                        totalClasses: 1,
                        attendedClasses: student.status === 'present' ? 1 : 0
                    }
                },
                upsert: true
            }
        }));

        await StudentSubject.bulkWrite(bulkOps);

        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get attendance by subject
export const getAttendanceBySubject = asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const userId = req.user._id; // Get the authenticated user's ID

    
    // Verify the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
  
    // Find all attendance records for this subject
    const attendanceRecords = await Attendance.find({ 
      subject: subjectId 
    }).sort({ date: -1 });
  
    res.status(200).json({
      success: true,
      data: attendanceRecords
    });
  });



// Update attendance record
export const updateAttendance = async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const { students } = req.body;

        const attendance = await Attendance.findById(attendanceId);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        // Update attendance
        attendance.students = students;
        await attendance.save();

        // Update StudentSubject records
        const bulkOps = students.map(student => ({
            updateOne: {
                filter: {
                    student: student.student,
                    subject: attendance.subject
                },
                update: {
                    $inc: {
                        attendedClasses: student.status === 'present' ? 1 : -1
                    }
                }
            }
        }));

        await StudentSubject.bulkWrite(bulkOps);

        res.status(200).json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete attendance record
export const deleteAttendance = async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const attendance = await Attendance.findById(attendanceId);
        
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        // Update StudentSubject records
        const bulkOps = attendance.students.map(student => ({
            updateOne: {
                filter: {
                    student: student.student,
                    subject: attendance.subject
                },
                update: {
                    $inc: {
                        totalClasses: -1,
                        attendedClasses: student.status === 'present' ? -1 : 0
                    }
                }
            }
        }));

        await StudentSubject.bulkWrite(bulkOps);
        await Attendance.findByIdAndDelete(attendanceId);

        res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get student's attendance percentage by subject
export const getStudentAttendanceBySubject = async (req, res) => {
    try {
        const { studentId, subjectId } = req.params;
        const studentSubject = await StudentSubject.findOne({
            student: studentId,
            subject: subjectId
        });

        if (!studentSubject) {
            return res.status(404).json({ message: 'No attendance records found' });
        }

        const attendancePercentage = (studentSubject.attendedClasses / studentSubject.totalClasses) * 100;

        res.status(200).json({
            totalClasses: studentSubject.totalClasses,
            attendedClasses: studentSubject.attendedClasses,
            attendancePercentage: attendancePercentage.toFixed(2)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
import Attendance from '../models/attendance.model.js';
import StudentSubject from '../models/studentSubject.model.js';

export const markAttendance = async (req, res) => {
    try {
      const { subjectId, students, date } = req.body;
      
      // Validate input
      if (!subjectId || !students || students.length === 0) {
        return res.status(400).json({ message: 'Invalid attendance data' });
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
 
      // Bulk update for student subject attendance
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

import { Subject } from "../models/subject.model.js";
import asyncHandler from "../utils/asyncHandler.js";
export const createSubject = asyncHandler(async (req, res) => {
    try {
      const subject = new Subject({
        name: req.body.name,
        code: req.body.code,
        semester: req.body.semester,
        creditHours: req.body.creditHours,
        teacher: req.user._id
      });
      await subject.save();
      res.status(201).json(subject);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  export const getSubjects = asyncHandler(async (req, res) => {
    try {
      // Log the user making the request
      console.log("Requesting user:", req.user);
  
      // Fetch subjects for the logged-in teacher
      const subjects = await Subject.find({ teacher: req.user._id }).populate('teacher', 'email');
      console.log("Fetched subjects:", subjects);
  
      if (!subjects || subjects.length === 0) {
        return res.status(404).json({ message: 'No subjects found for this teacher' });
      }
  
      res.status(200).json({ success: true, data: subjects });
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
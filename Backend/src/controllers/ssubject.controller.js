
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
  
  export const getSubjects = async (req, res) => {
    try {
      const subjects = await Subject.find().populate('teacher', 'email');
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
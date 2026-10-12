import { Subject } from "../models/subject.model.js";
import { StudentSubject } from "../models/studentSubject.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/errorHandler.js";
import { Assignment } from "../models/assignment.model.js";

// Admins assign subjects to a teacher; the id must belong to a teacher account.
const findTeacher = async (id) => {
  const teacher = await User.findOne({ _id: id, role: "Teacher" }).select("_id");
  if (!teacher) throw new apiError(400, "Choose a teacher for this subject");
  return teacher._id;
};

export const createSubject = asyncHandler(async (req, res) => {
  const { name, code, semester, creditHours } = req.body;
  const teacher = req.user.role === "Admin" ? await findTeacher(req.body.teacher) : req.user._id;
  const subject = await Subject.create({ name, code, semester, creditHours, teacher });

  // Enroll the students of this subject's semester (new students of that
  // semester are enrolled at signup; see user.controller).
  const students = await User.find({ role: "Student", semester: subject.semester }).select("_id");
  await StudentSubject.insertMany(
    students.map((student) => ({ student: student._id, subject: subject._id, semester: subject.semester }))
  );

  res.status(201).json(subject);
});

export const getSubjects = asyncHandler(async (req, res) => {
  let subjects;
  if (req.user.role === "Admin") {
    subjects = await Subject.find().populate("teacher", "fullName email").sort({ semester: 1, name: 1 });
  } else if (req.user.role === "Teacher") {
    subjects = await Subject.find({ teacher: req.user._id }).populate("teacher", "email");
  } else {
    const enrollments = await StudentSubject.find({ student: req.user._id }).populate({
      path: "subject",
      populate: { path: "teacher", select: "email" },
    });
    subjects = enrollments.map((e) => e.subject);
  }

  // An empty list is a normal state (new teacher / student), not an error.
  // Enrollment rows can outlive a deleted subject, so drop nulls.
  res.status(200).json({ success: true, data: subjects.filter(Boolean) });
});

export const getSubjectById = asyncHandler(async (req, res) => {
  const subject =
    req.user.role === "Teacher"
      ? await Subject.findOne({ _id: req.params.id, teacher: req.user._id })
      : (await StudentSubject.findOne({ subject: req.params.id, student: req.user._id }).populate("subject"))?.subject;

  if (!subject) throw new apiError(404, "Subject not found");
  res.status(200).json({ success: true, data: subject });
});

// Admin: hand a subject to another teacher. Its assignments move with it so the
// new teacher can manage them; past attendance stays as recorded.
export const assignSubjectTeacher = asyncHandler(async (req, res) => {
  const teacher = await findTeacher(req.body.teacher);
  const subject = await Subject.findByIdAndUpdate(req.params.id, { teacher }, { new: true }).populate("teacher", "fullName email");
  if (!subject) throw new apiError(404, "Subject not found");
  await Assignment.updateMany({ subject: subject._id }, { teacher });
  res.status(200).json({ success: true, data: subject });
});

import express from "express";
import { assignSubjectTeacher, createSubject, getSubjects, getSubjectById } from "../controllers/subject.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/roleCheck.middleware.js";

const router = express.Router();
router.use(authenticateUser);

router.route("/")
  .post(restrictTo("Teacher", "Admin"), createSubject)
  .get(getSubjects);

router.get("/:id", getSubjectById);
router.patch("/:id/teacher", restrictTo("Admin"), assignSubjectTeacher);

export default router;

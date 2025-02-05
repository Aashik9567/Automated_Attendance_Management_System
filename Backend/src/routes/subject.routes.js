// routes/subject.routes.js
import express from 'express';
import { 
  createSubject, 
  getSubjects, 
  getSubjectById, 
} from '../controllers/subject.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/roleCheck.middleware.js';

const router = express.Router();

router.route("/")
  .post(authenticateUser, restrictTo('Teacher'), createSubject)
  .get(authenticateUser, getSubjects);  // This handles GET /api/v1/subjects

router.route('/:id')
  .get(authenticateUser, getSubjectById);
export default router;
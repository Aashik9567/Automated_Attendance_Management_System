// routes/subject.routes.js
import express from 'express';
import { 
  createSubject, 
  getSubjects, 
  getSubjectById 
} from '../controllers/subject.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/createsubject").post(authenticateUser, createSubject);
router.route('/getsubject').get(authenticateUser, getSubjects);
router.route('/:id').get(authenticateUser, getSubjectById);

export default router;
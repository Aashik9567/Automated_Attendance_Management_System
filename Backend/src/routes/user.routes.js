import { Router } from "express";
import { getAllStudents, loginUser, logoutUser, signupUser, } from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";



const router=Router();
router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authenticateUser,logoutUser);
router.route("/students").get(authenticateUser,getAllStudents);
export default router;
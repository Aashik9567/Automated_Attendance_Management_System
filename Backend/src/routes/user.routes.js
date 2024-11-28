import { Router } from "express";
import { loginUser, logoutUser, signupUser, } from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";



const router=Router();
router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authenticateUser,logoutUser);

export default router;
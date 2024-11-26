import { Router } from "express";
const router=Router();
import { signupUser, } from "../controllers/user.controller.js";
router.route("/signup").post(signupUser);

export default router;
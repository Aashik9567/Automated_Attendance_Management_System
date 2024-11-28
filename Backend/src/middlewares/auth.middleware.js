import { User } from "../models/user.model.js";
import { apiError } from "../utils/errorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const authenticateUser = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new apiError(401, "Please authenticate to access this route");
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("-password -refreshToken");
 
        if(!user){
            throw new apiError(401, "Invalid token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401,"something went wrong while authenticating user");
    }
});
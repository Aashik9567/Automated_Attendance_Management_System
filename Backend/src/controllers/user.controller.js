import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";


const signupUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new apiResponse(200,"pending",""))
});


export {signupUser, }
import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";
import jwt from 'jsonwebtoken';

const options = {
    httpOnly: true,
    secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAcessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new apiError(500, "Error generating tokens");
    }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
      throw new apiError(401, "Unauthorized request");
  }

  try {
      const decodedToken = jwt.verify(
          incomingRefreshToken, 
          process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decodedToken._id);

      if (!user) {
          throw new apiError(401, "Invalid refresh token");
      }

      if (incomingRefreshToken !== user.refreshToken) {
          throw new apiError(401, "Refresh token is expired or used");
      }

      const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

      return res.status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(new apiResponse(200, "Access token refreshed", { 
              accessToken, 
              refreshToken 
          }));

  } catch (error) {
      throw new apiError(401, error?.message || "Invalid refresh token");
  }
});
const signupUser = asyncHandler(async (req, res) => {
    const { fullName, semester, email, password,role } = req.body;
    if (!fullName || !email || !password || !role || !semester) {
        throw new apiError(401, "please provide all the details ");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new apiError(400, "User already exists, please proceed to login");
    }
    const user = await User.create({
        fullName,
        semester,
        email,
        password,
        role,
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while creating user");
    }
    
   
    return res.status(200).json(new apiResponse(200,"user registered successfully",createdUser));
});

const loginUser = asyncHandler(async(req,res)=>{
  const { email, password } = req.body;
  if (!(email || password )) {
      throw new apiError(400, "please provide all the details ");
  }
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
      throw new apiError(401, "Invalid email or password");
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);
  const loginUser = await User.findById(user._id).select("-password -refreshToken")
  if(!loginUser) {
      throw new apiError(500, "Something went wrong while logging in user");
  }
  return res.status(200)
  .cookie("refreshToken",refreshToken,options)
  .cookie("accessToken",accessToken,options)
  .json(new apiResponse(200,"user logged in successfully",{loginUser,accessToken,refreshToken}))
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
      req.user?._id,
      { $unset:
          {refreshToken:1}
      },
      {new:true}
  )
  res.clearCookie("refreshToken",options).clearCookie("accessToken",options).json(new apiResponse(200,"user logged out successfully",null))
})

export const getAllStudents = async (req, res) => {
    try {
      const students = await User.find({ 
        role: 'Student' 
      }).select('fullName email semester avatar');
  
      res.status(200).json({
        success: true,
        count: students.length,
        data: students
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Error fetching students', 
        error: error.message 
      });
    }
  };

export {signupUser,loginUser,logoutUser,refreshAccessToken }
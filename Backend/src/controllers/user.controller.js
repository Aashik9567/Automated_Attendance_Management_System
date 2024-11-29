import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";

const option = {
    httpOnly: true,
    secure: true,
  };
const generateAcessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAcessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({
        validateBeforeSave: false,
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new apiError(
        500,
        "something went wrong while generating access and refresh token"
      );
    }
  };
const signupUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password,role } = req.body;
    if (!firstName || !email || !password || !role) {
        throw new apiError(400, "please provide all the details ");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new apiError(400, "User already exists, please proceed to login");
    }
    const user = await User.create({
        firstName,
        lastName,
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

    const {accessToken,refreshToken} =await generateAcessAndRefreshToken(user._id);
    const loginUser = await User.findById(user._id).select("-password -refreshToken")
    if(!loginUser) {
        throw new apiError(500, "Something went wrong while logging in user");
    }
    return res.status(200)
    .cookie("refreshToken",refreshToken,option)
    .cookie("accessToken",accessToken,option)
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
    res.clearCookie("refreshToken",option).clearCookie("accessToken",option).json(new apiResponse(200,"user logged out successfully",null))
})



export {signupUser,loginUser,logoutUser }
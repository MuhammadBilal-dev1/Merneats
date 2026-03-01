import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email";
import dotenv from 'dotenv'
dotenv.config()

// sign up
export const signup = async (req:Request, res:Response) => {
  try {
    const {fullname, email, password, contact} = req.body

    let user = await User.findOne({email})
    if (user) {
       res.status(400).json({
        success: false,
        message: "User alredy exists",
        error: true,
      })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationToken = generateVerificationCode()

    user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      contact: Number(contact),
      verificationToken,
      verificationTokenExpiresAt: Date.now()+24*60*60*1000, 
    })

    generateToken(res, user)
    await sendVerificationEmail(email, verificationToken)

    const userWithoutPassword = await User.findOne({email}).select("-password")

     res.status(201).json({
      success: true,
      message: "Account created successfully.",
      error: false,
      user: userWithoutPassword,
    })
    return

  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal server error!",
    })
  }
}

// login
export const login = async(req: Request, res: Response) => {
  try {
    const { email, password} = req.body
    const user = await User.findOne({email})
    if (!user) {
       res.status(400).json({
        success: false,
        message: "Invalid email and password!",
        error: true
      })
      return
    }

    const isMatchedPasword = await bcrypt.compare(password, user.password)
    if (!isMatchedPasword) {
      
       res.status(400).json({
        success: false,
        message: "Invalid email and password!",
        error: true
      })
      return
    }

    generateToken(res, user)
    user.lastLogin = new Date()
    await user.save()

    // send user without password
    const userWithOutPassword = await User.findOne({email}).select("-password")
     res.status(200).json({
      user: userWithOutPassword,
      success: true,
      message: `Welcome back ${user.fullname}`,
      error: false
    })
    return
    
  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: true
    })
    return
  }
}

// verifying email
export const verifyEmail = async (req:Request, res:Response) => {
  try {
    const {verificationCode} = req.body
    
    const user = await User.findOne({verificationToken: verificationCode, verificationTokenExpiresAt: { $gt: Date.now() }}).select("-password")

    if (!user) {
       res.status(400).json({
        success: false,
        message: "Invalid verification token!",
        error: true,
      })
      return
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiresAt = undefined
    await user.save()

    // send welcome email
    await sendWelcomeEmail(user.email, user.fullname)

     res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      error: false,
      user,
    })
    return
  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: true
    })
    return
  }
}

// logout
export const logout = async (req: Request, res: Response) => {
  try {
     res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully.",
      error: false
    })
    return
  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: true
    })
    return
  }
}

// forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email} = req.body
    const user = await User.findOne({email})
   if (!user) {
     res.status(400).json({
      success: false,
      message: "User doesn't exist.",
      error: true
    })
    return
    } 
    
    const resetToken = crypto.randomBytes(40).toString("hex")
    const resetTokenExpiresAt = new Date(Date.now() + 1*60*60*1000) // 1 hour
    user.resetPasswordToken = resetToken
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt
    await user.save()

    // send email
    await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`)

     res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
      error: false,
    }) 
    return

  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: true
    })
    return
  }
}

// reset token
export const resetToken = async (req:Request , res: Response) => {
  try {
    const { token} = req.params
    const { newPassword } = req.body
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: {$gt: Date.now()} })
    if (!user) {
       res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
        error: true
      })
      return
    }

    // update password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.verificationTokenExpiresAt = undefined
    await user.save()

    // send success reset email
    await sendResetSuccessEmail(user.email)

     res.status(200).json({
      success: true,
      message: "Password reset successfully.",
      error: false,
    })
    return

  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: true
    })
    return
  }
}

// check auth
export const checkAuth = async (req:Request, res:Response) => {
  try {
    const userId = req.id
    const user = await User.findById(userId).select("-password")
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        error: true
      })
      return 
    }
     res.status(200).json({
      user,
      success: true,
      error: false
    })
    return
  } catch (error) {
    console.log(error);
   res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: true
    })
  }
}

// update profile
export const updateProfile = async (req:Request, res:Response) => {
  try {
    const userId = req.id
    const { fullname, email, address, city, country, profilePicture} = req.body

    
    // upload image on cloudinary
    let cloudResponse:any
    const base64Image = profilePicture.split(",")[1]
    cloudResponse = await cloudinary.uploader.upload(profilePicture)
    const updateData = { fullname, email, address, city, country, profilePicture}

    const user = await User.findByIdAndUpdate(userId, updateData, {new: true}).select("-password")


     res.status(200).json({
      user,
      message: "Profile updated successfully.",
      success: true,
      error: false
    })
    return
  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: true
    })
    return
  }
}
import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

declare global{
  namespace Express{
    interface Request{
      id: string
    }
  }
}

export const isAuthenticated = async (req: Request, res:Response, next:NextFunction) => {
  try {
    const token = req.cookies?.token
    if (!token) {
       res.status(401).json({
        success: false,
        message: "User not authenticated.",
        error: true
      })
      return
    }

    // verifying token
    const decode = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload
    // checking if decoding was successfull
    if (!decode) {
       res.status(401).json({
        success: false,
        message: "Invalid token.",
        error: true
       })
       return
    }
    req.id = decode.userId
    next()
  } catch (error) {
    res.status(500).json({message: "Authentication error"})
  }
}
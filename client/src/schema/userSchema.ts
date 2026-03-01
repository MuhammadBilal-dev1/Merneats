import { z } from 'zod'

export const userSignupSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 character"),
  contact: z.string().min(10, "Contact number must be atleast 10 character")
})

export type SignupInputState = z.infer<typeof userSignupSchema>

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 character"),
})

export type LoginInputState = z.infer<typeof userLoginSchema>
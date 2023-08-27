import express from 'express';
import { login, register, verifyOtp } from '../controllers/user.js';

const userRouter = express.Router();

userRouter.post("/register", register)
userRouter.post("/verify-user", verifyOtp)
userRouter.post("/login", login)

export default userRouter;
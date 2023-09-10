import express from "express";
import { Strategy } from "passport-google-oauth20";
import passport from "passport";

import dotenv from "dotenv";
import { forgetPassword, login, register, resetPassword, sendquerymail, signInWithGoogle, verifyOtp } from "../controllers/user.js";
import User from "../models/User.js";


dotenv.config();
const userRouter = express.Router();


// GOOGLE OAUTH
// this is a new comment

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(
  new Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
   async function (accessToken, refreshToken, profile, done) {
      // console.log(accessToken);
      // const user = await User.findOne({accessToken});
      // if(!user){
      //   signInWithGoogle;
      // }
      done(null, { profile });
    }
  )
);

userRouter.post("/register", register);
userRouter.post("/verify-user", verifyOtp);
userRouter.post("/login", login);
userRouter.post("/sendmail", sendquerymail);

userRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/fail" }),
  signInWithGoogle
);

userRouter.get("/fail", (req, res, next) => {
  res.send("user logged in failed");
});

userRouter.post("/forget/password", forgetPassword);
userRouter.post("/reset/password", resetPassword);

export default userRouter;

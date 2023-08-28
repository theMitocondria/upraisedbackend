import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './database.js';
import user from './routes/user.js';
import session from "express-session";
import { Strategy } from "passport-google-oauth20";
import passport from "passport";


const app = express();

// configuring the dotenv file so that we can access the envirmental vairables
dotenv.config();

//making the function call to connect to databse;
connectDatabase();

// using the cors , to avoid getting the cors errors in frontend
app.use(cors());




//running the middlares
app.use(express.static("public"));
app.use(express.json());
app.use(
    session({
      secret: "Enter your secret key",
      resave: true,
      saveUninitialized: true,
    })
  );


  app.use(passport.initialize());
  app.use(passport.session());
  


const port = process.env.PORT;



app.use("/auth", user);




// app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth/fail'}),
//     (req, res, next) => {
//         console.log(req.user, req.isAuthenticated());
       
//         res.send('user is logged in');
//     })

// app.get('/auth/fail', (req, res, next) => {
//     res.send('user logged in failed');
// });








app.listen(process.env.PORT, () => {
    console.log(`port is running at ${process.env.PORT}`)
})

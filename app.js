// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
import connectDatabase from './database.js';
// import user from './routes/user.js';

// const app = express();

// // configuring the dotenv file so that we can access the envirmental vairables
// dotenv.config();

// // using the cors , to avoid getting the cors errors in frontend
// app.use(cors());

// //making the function call to connect to databse;
// connectDatabase();


// //running the middlares
// app.use(express.static("public"));
// app.use(express.json());



// app.use("/auth", user);


// app.listen(process.env.PORT, () => {
//     console.log(`port is running at ${process.env.PORT}`)
// })



import express from "express";
import dotenv from "dotenv";
// import connectDatabase from "./Databse.js";
import {Strategy} from 'passport-google-oauth20';
import passport from 'passport';
import session from 'express-session';
// import axios from 'axios';
const app = express();
connectDatabase();

// env consts
dotenv.config();
const port = process.env.PORT;

app.use(session({ 
    secret: 'Enter your secret key',
    resave: true,
    saveUninitialized: true
}))


// GOOGLE OAUTH

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

passport.use(new Strategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    function (accessToken, refreshToken, profile, done) {
        // if user already exist in your dataabse login otherwis
        // console.log({"p":profile})
        // save data and signup
        done(null, {profile});
    }
));


app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth/fail'}),
    (req, res, next) => {
        console.log(req.user, req.isAuthenticated());
        res.send('user is logged in');
    })

app.get('/auth/fail', (req, res, next) => {
    res.send('user logged in failed');
});


// app endpoint listen
app.listen(port,()=>{
    console.log(`Connection made on ${port} port`);
})
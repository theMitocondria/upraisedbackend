import User from '../models/User.js'
import { sendEmail } from './sendMail.js';

export const register = async(req, res) => {
    try{
        const {email, password, confirmPassword, name} = req.body;
        if (!email ||  !name  ||  !password || !confirmPassword) {
            res.status(400).json({
               message: "provide all the credentials",
               success: false,
           })
       }

       if(confirmPassword != password){
        res.status(400).json({
            message:"password did not match", 
            success: false,
        })
       }

       
       const emailfound = await User.findOne({email});
       if(emailfound && emailfound.isVerified){
           return res.status(401).json({
               message:"User already exists, please login",
               success: false
           })
       }else if(emailfound){
        await User.deleteMany({email});
       }

       let verificationCode = Math.ceil(Math.random() * 1000000);
         
       while(verificationCode<100000){
           verificationCode = Math.ceil(Math.random() * 1000000);
       }


       await sendEmail(email, "verificationCode", verificationCode, name);
       const verificationCodeExpiresAt = new Date().getTime() + 10 * 60 * 1000; // Expires in 10 minutes

       const user = new User({name, email, password,  verificationCode, verificationCodeExpiresAt});

       await user.save();
       res.status(200).json({
        message:"Otp send successsfully",
        success: true,
        user
       })

    }catch(e){
        res.status(500).json({
            message:`${e}`,
            success: false
           })
    
    }
}

export const verifyOtp = async(req, res) => {
    try{


        const {email, verificationCode } = req.body;

        const user = await User.findOne({
            email, 
            verificationCode,
            verificationCodeExpiresAt:{$gt: new Date()},
        })

        

        if(!user){
            return res.status(400).json({
                message:"Invalid verification code or expired"
            });
        }




        user.isVerified = true;
        user.verificationCodeExpiresAt = new Date();
        await user.save();
        console.log("verifed")
        res.status(200).json({
            message:"user verified successfully", 
            success: true,
            user
        })

    }catch(e){
        res.status(500).json({
            message:`${e}`,
            success: false
           })
    }
}

export const login = async(req, res) => {
    try{
        const {email, password} = req.body;

        // checking email, password
        if (!email || !password) {
            return res.status(400).json({
                message: "email or password cant be null",
                success: false,
            })
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({
                message: "invalid email or password"
            })
        }
        

        

        const passwordCheck = await user.matchPassword(password);

        if (!passwordCheck) {
            return res.status(401).json({
                message: "invalid email or password"
            })
        }
        
        

        res.status(200).json({
            message:"Login success", 
            success: true,
        })
    }catch(e){
        res.status(500).json({
            message:`${e}`,
            success: false
           })
    }
}
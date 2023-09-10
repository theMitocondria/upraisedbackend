import generateToken from '../middlewares/generateToken.js';
import { sendResetPasswordEmail } from '../middlewares/sendResetPasswordEmail.js';
import User from '../models/User.js'

import sendEmail from '../middlewares/sendMail.js'

export const register = async(req, res) => {
    try{
        const {email, password, confirmPassword, name, phoneNo} = req.body;
        if (!email ||  !name  ||  !password || !confirmPassword|| !phoneNo ) {
           return res.status(400).json({
               message: "provide all the credentials",
               success: false,
           })
       }
       console.log(email, password, phoneNo)

       if(confirmPassword != password){
       return res.status(400).json({
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

       const user = new User({name, email, password, phoneNo, verificationCode, verificationCodeExpiresAt});
       user.token = generateToken(user.email);
       await user.save();
       return res.status(200).json({
        message:"Otp send successsfully",
        success: true,
        user
       })

    }catch(e){
      return  res.status(500).json({
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
       return res.status(200).json({
            message:"user verified successfully", 
            success: true,
            user
        })

    }catch(e){
      return  res.status(500).json({
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

        console.log(email, password);
        

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

export const signInWithGoogle = async(req, res) => {
   try{

        const email = req.user.profile._json.email;
        const name = req.user.profile.displayName;
        const googleId = req.user.profile.id;
        const token = generateToken(email);

        let user = await User.findOne({email});

        if(user && user.isVerified){
          return  res.status(200).json({
                message:"User login successfully",
                success:true, 
                user
            })
        }

         user = new User({email, name, isVerified: true,googleId, token})
        console.log(user);  
        await user.save();
       return res.status(200).json({
            message:"User login successfully",
            success:true, 
            user
        })
      
   }catch(e){
    return res.status(500).json({
        message:`${e}`,
        success: false
       })
   }
}

export const forgetPassword = async(req, res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false, 
                message:"Email not found",
            })
        }

        let random = Math.random();

        const resetToken = generateToken(random);

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpires = Date.now()+1000*60*10;

        await user.save();

        const resetUrl = `http://localhost:3000/reset/password/`+resetToken;

        
        await sendResetPasswordEmail(user.name,email, resetUrl);

        return res.status(200).json({
            message:"Link send successfully", 
            success: true,
            resetUrl
        })


    }catch(e){
        res.status(500).json({
            message : error.message,
            success: false,
        })
    }
}

export const resetPassword = async(req, res) => {
    try{

        const {password,id}  = req.body;
        console.log(`this is token ${id}`);
        console.log(password);
        const user = await User.findOne({
            resetPasswordToken:id,
            resetPasswordTokenExpire: { $gt: Date.now() },
        })

        console.log(user);

        if(!user){
            return res.status(401).json({
                success:false,
                message:"token is not valid or expired"
            })
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpire = Date.now();
        await user.save();
        

        return res.status(200).json({
            success: true,
            message:"password updated succcessfully."
        })

    }catch (error) {

        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}

export const sendquerymail = async(req, res) => {
    try{

        const {name, email, phoneNo, message}  = req.body;
        
        await sendEmail(email, message, `${message} ${name} query from user with details ${phoneNo} ${email}`)

        return res.status(200).json({
            success: true,
            message:" Query send Successfuly to the owner"
        })



    }catch (error) {

        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}
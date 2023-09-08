import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({

  name: { type: String },
  email: { type: String},
  phoneNo:{type:String},
  password: { type: String, default:"1"},
  googleId: { type: String },
  token:{type: String},
  resetPasswordToken: {type: String},
  resetPasswordTokenExpires : {type: Date},
  isVerified: { type: Boolean, default: false },
  verificationCode:{type:String},
  verificationCodeExpiresAt: {type: Date},
});



userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 4);
    }
    next();
})

userSchema.method('matchPassword', async function(givenPassword){
   
    return bcrypt.compare(givenPassword, this?.password);
})

const User = new mongoose.model('User', userSchema);

 export default User;
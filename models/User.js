import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  token:{type: String},
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
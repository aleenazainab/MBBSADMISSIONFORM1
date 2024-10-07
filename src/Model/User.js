import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  regnum: { type: String, required: true, unique: true },
  //email: { type: String, required: true, unique: true },
  cnic: { type: String, required: true },
  password: { type: String, required: true },
  //role: { type: String, enum: ['student', 'admin'], required: true } ,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
  }
  next();
});

export default mongoose.model('User', UserSchema);

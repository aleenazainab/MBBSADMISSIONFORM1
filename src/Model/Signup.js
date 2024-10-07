import mongoose from 'mongoose';
const signupSchema =new mongoose.Schema({
    regnum: String,
    cnic:String,
    password: String
})
export const SignupModel = mongoose.model('signups', signupSchema);
export default SignupModel;
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import UserModel from './Model/User.js'; 
import SignupModel from './Model/Signup.js'; 
import FormModel from './Model/Form.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const app = express();
dotenv.config(); 
console.log('Database URL:', process.env.DATABASE_URL);


app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);

//const uri = process.env.DATABASE_URL;

const uri = 'mongodb+srv://aleenazainab:aleena123%40@cluster0.zxw1k.mongodb.net/MbbsAdmissionForm?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

  

// Route to handle login submission
app.post('/login', async (req, res) => {
  const { regnum, password } = req.body;

  try {
    const user = await UserModel.findOne({ regnum });
    
    if (!user) {
     
      return res.status(404).json({ error: 'User with this registration number does not exist. So Please Signup' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while logging in', details: err.message });
  }
});

// Route to handle signup submission
app.post('/signup', async (req, res) => {
  const { regnum, cnic, password } = req.body;

  try {
 
    const existingUser = await UserModel.findOne({ regnum });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this registration number already exists' });
    }

    // Create a new user
    const newUser = new UserModel({ regnum, cnic, password });
    await newUser.save();

    // Automatically log in the new user
    const loggedInUser = await UserModel.findOne({ regnum });
    if (!loggedInUser || !(await bcrypt.compare(password, loggedInUser.password))) {
      return res.status(500).json({ error: 'An error occurred while logging in after signup' });
    }

    res.status(200).json(loggedInUser);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while signing up', details: err.message });
  }
});

app.post('/submitform', async (req, res) => {
  try {
      const form = new FormModel(req.body);
      await form.save();
      res.status(201).json(form);
  } catch (error) {
      console.error("Error saving form:", error);
      res.status(500).json({ error: 'An error occurred while submitting the form.' });
  }
});


const port = process.env.PORT || 5001; // Use environment variable
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);


//app.listen(5001, () => {
 // console.log('Server is running on port 5001');
});

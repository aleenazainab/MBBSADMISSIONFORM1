import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Login from './Components/Landing/Login/Login.js';
import Signup from './Components/Landing/Signup/Signup.js';
import Form from './Components/Landing/Form/Form.js';
import Endpage from './Components/Landing/Endpage/endpage.js';
//import ResetPassword from './Components/Landing/ResetPassword/Resetpassword.js'; // Corrected capitalization
//import ForgotPassword from './Components/Landing/ForgotPassword/forgotpassword.js'; // Corrected name

function App() {
  const [step] = useState(0); // Manage which step to display

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]); // Reset scroll position on step change

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
       
        <Route path='/form' element={<Form />} />
        <Route path='/endpage' element={<Endpage />} />
      </Routes>
    </Router>
  );
}

export default App;

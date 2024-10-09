import React, { useState } from 'react';
import './login.scss';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [regnum, setRegnum] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleRegnumChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,5}$/.test(value)) {
      setRegnum(value);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!regnum || !password) {
      setErrors({ general: "Please fill in all fields." });
      return;
    }

    try {
      const result = await axios.post('http://localhost:5001/login', { regnum, password });
      console.log("Server Response:", result.data); // Log the response for debugging

      // Adjust the destructuring based on the correct response structure
      const { regnum: fetchedRegnum, cnic } = result.data;

      setErrors({});
      navigate('/form', { state: { regnum: fetchedRegnum, cnic } });
    } catch (err) {
      console.error(err);

      const errorMessage = err.response?.data?.error || 'An error occurred while logging in';
      setErrors({ general: errorMessage });
    }
  };

  return (
    <>
      <section className="login">
        <Link to="/signup" className="signupbutton">
          SIGN UP
        </Link>

        <div className="signinpage">
          <h1>Admission Form for MBBS Program</h1>
          <form className="signininner" onSubmit={handleSignin}>

            <div className="inputdivvvv">
              <p>MBBS Registration Number</p>
              <input
                type="text"
                id="regnum"
                name="regnum"
                value={regnum}
                placeholder="XXXXX"
                onChange={handleRegnumChange}
                maxLength="5"
                required
              />
              {errors.general && (
                <span className="error-inline">{errors.general}</span>
              )}
            </div>

            <div className="inputdivvvv">
              <p>Password</p>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Abc@678910"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span 
                  className="eye-icon" 
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
                {errors.password && (
                  <span className="error-inline">{errors.password}</span>
                )}
              </div>
            </div>

            <div className="upperdiv">
              <div className="forchec">
                <label className="checkbox-button">
                  <input
                    type="checkbox"
                    className="checkbox-button__input"
                    id="keepLoggedIn"
                    name="keepLoggedIn"
                  />
                  <span className="checkbox-button__control">Keep me logged in</span>
                </label>
              </div>
        
              <button type="submit">SIGN IN</button>
            </div>
          </form> 
        </div>
      </section>
    </>
  );
};

export default Login;

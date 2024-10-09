import React, { useState } from 'react';
import './signup.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [regnum, setRegnum] = useState("");
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  

  const navigate = useNavigate();

  const validatePassword = (new_pass) => {
    let errorMessage = "";
    const lowerCase = /[a-z]/g;
    const upperCase = /[A-Z]/g;
    const numbers = /[0-9]/g;

    if (!new_pass.match(lowerCase)) {
      errorMessage = "Password should contain lowercase letters!";
    } else if (!new_pass.match(upperCase)) {
      errorMessage = "Password should contain uppercase letters!";
    } else if (!new_pass.match(numbers)) {
      errorMessage = "Password should contain numbers!";
    } else if (new_pass.length < 10) {
      errorMessage = "Password length should be more than 10 characters.";
    }
    return errorMessage;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!regnum || !cnic || !password) {
      setErrors({ general: "Please fill in all fields." });
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors) {
      setErrors({ password: passwordErrors });
      return;
    }
    if (cnic.length !== 13) {
      setErrors({ cnic: "CNIC must be exactly 13 digits." });
      return;
    }
    if (regnum.length !== 5) {
      setErrors({ regnum: "Registration number must be exactly 5 digits." });
      return;
    }
  

    try {
      const result = await axios.post('http://localhost:5001/signup', { regnum, cnic, password });
      console.log(result.data);

      setErrors({});
      navigate('/form', { state: { regnum, cnic } });
    } catch (err) {
      console.log(err);
      setErrors({ general: err.response?.data?.error || 'An error occurred while signing up' });
    }
  };

  // Restrict regnum to 5 digits
  const handleRegnumChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,5}$/.test(value)) {
      setRegnum(value);
    }
  };

  // Restrict CNIC to 14 digits
  const handleCnicChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,13}$/.test(value)) {
      setCnic(value);
    }
  };

  return (
    <>
      <section className="signup">
        <div className="signuppage">
          <h1>Admission Form for MBBS Program</h1>
          <form className="signupinner" onSubmit={handleSignup}>

            <div className="inputdivvvv">
              <p>MBBS Registration Number</p>
              <input
                type="text"
                id="regnum"
                name="regnum"
                placeholder="XXXXX"
                value={regnum}
                onChange={handleRegnumChange}
                maxLength="5"
                required
              />
              {errors.regnum && (
                <span className="error-inline">
                  {errors.regnum}
                </span>
              )}
            </div>

            <div className="inputdivvvv">
              <p>CNIC</p>
              <input
                type="text"
                id="cnic"
                name="cnic"
                placeholder="XXXXXXXXXXXXX"
                value={cnic}
                onChange={handleCnicChange}
                maxLength="13"
                required
              />
              {errors.cnic && (
                <span className="error-inline">
                  {errors.cnic}
                </span>
              )}
            </div>

            <div className="inputdivvvv">
              <p>Password</p>
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
              {showPassword ? '👁️' : '👁️‍🗨️'} {/* Eye icon */}
            </span>
              {errors.password && (
                <span className="error-inline">
                  {errors.password}
                </span>
              )}
            </div>

            {errors.general && (
              <span className="error-inline">
                {errors.general}
              </span>
            )}

            <button type="submit">SIGN UP</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Signup;

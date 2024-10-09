import React from 'react';
import './welcome.scss'; // Ensure you create this CSS file for styling
import { useNavigate } from 'react-router-dom';
const WelcomePage = () => {
    const navigate = useNavigate();
  
    const handleNext = () => {
      navigate('/login'); 
    };
  return (
    <>
     <section className="main_banner">
    <div className="welcome-container">
    <img src='/assets/air-university.png' className='university-logo' alt="University Logo" />
     
      <h1 className="main-heading">Welcome to Air University Islamabad</h1>
      
      
      <p className="note">
        Note: Only fill this form using your computer or laptop; otherwise, your PDF will not be downloaded. 
        <br /> 
        Please refrain from using mobile phones or tablets to access this portal.
      </p>
      <button className="next-button" onClick={handleNext}>
          Next
        </button>
        <p>Press Next for registration</p>
    </div>
    </section>
    </>
  );
};

export default WelcomePage;

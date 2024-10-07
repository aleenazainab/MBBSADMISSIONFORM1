import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa'; 
import './endpage.scss'; 

const Endpage = () => {

    useEffect(() => {
        const handleBackButton = (event) => {
            event.preventDefault();
            window.history.pushState(null, null, window.location.href);
        };

        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, []);

    return (
        <div className="endpage-container">
            <FaCheckCircle className="check-icon" />
            <h1>Your form has been successfully submitted!</h1>
            <h3>Print the downloaded form and submit it to your college</h3>
        </div>
    );
};

export default Endpage;

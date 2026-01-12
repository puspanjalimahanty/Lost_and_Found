import React from 'react';
import './HeroSection.css';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="logo">
        <p>FindMyStuff</p>
      </div>
      <div className="overlay">
        <h1>Lost It? Found It? Post It!</h1>
        <h2>Your go-to platform for lost and found items.</h2>

        <div className="button-group">
          <button className="sign-in" onClick={() => navigate('/register')}>
            Register
          </button>
          <br></br>
          <br></br>
          <p className="login-text">
            Already registered?{' '}
            <span className="login-link" onClick={() => navigate('/login')}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

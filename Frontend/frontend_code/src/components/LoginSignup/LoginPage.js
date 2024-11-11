// src/LoginPage.js
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './LoginPage.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPassword from './ForgotPassword';
import googleLogo from './images/googlelogo.png';



const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Get the user type from the URL
  const query = new URLSearchParams(useLocation().search);
  const userType = query.get('type'); // 'customer' or 'owner'

  if (isForgotPassword) {
    return <ForgotPassword setIsForgotPassword={setIsForgotPassword} />;
  }

  return (
    <div className="login-page">
      {userType ? (
        <div className="login-card">
          {isSignup ? (
            <SignupForm userType={userType} />
          ) : (
            <>
              <LoginForm userType={userType} />
              <div className="login-options">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember Me
                </label>
                <a href="#" onClick={() => setIsForgotPassword(true)}>
                  Forgot Password?
                </a>
              </div>
              <button className="google-login-btn">
              <img src={googleLogo} alt="Google logo" />
                <span>Sign in with Google</span>
              </button>
            </>
          )}
          <p>
            <button onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </p>
        </div>
      ) : (
        <p>Please select a user type first.</p>
      )}
    </div>
  );
};

export default LoginPage;

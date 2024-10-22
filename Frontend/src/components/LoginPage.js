// src/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './LoginPage.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPassword from './ForgotPassword';
import googleLogo from './images/googlelogo.png';

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Set initial errorMessage to null
  const [userType, setUserType] = useState('customer'); // Default to 'customer' or null if needed

  const location = useLocation();

  // Function to handle Google Sign-in
  const handleGoogleLogin = () => {
    const usertype = userType == 'owner' ? true : false;
    window.open(`${process.env.REACT_APP_API_URL}/auth/google?type=${usertype}`, '_self');
  };

  // Effect to handle token and error from URL, reset errorMessage on mount
  useEffect(() => {
    setErrorMessage(null); // Reset error message every time component renders

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');
    const userTypeParam = params.get('type'); // Get userType from URL

    if (userTypeParam) {
      setUserType(userTypeParam); // Set userType to state if passed in the URL
    }

    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/'; // Redirect to home or another page
    }

    if (error) {
      setErrorMessage(error); // Set error message from URL
    }
  }, [location]);

  // Function to toggle signup/login and reset error message
  const toggleSignup = () => {
    setIsSignup(!isSignup);
    setErrorMessage(null); // Reset error message on toggling between signup and login
  };

  if (isForgotPassword) {
    return <ForgotPassword setIsForgotPassword={setIsForgotPassword} />;
  }

  return (
    <div className="login-page">
      {errorMessage && (
        <p className="error-message">{errorMessage}</p> // Display error message if exists
      )}

      <div className="login-card">
        {isSignup ? (
          <SignupForm userType={userType} />
        ) : (
          <>
            {/* Always show login form */}
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
            <button className="google-login-btn" onClick={handleGoogleLogin}>
              <img src={googleLogo} alt="Google logo" />
              <span>Sign in with Google</span>
            </button>
          </>
        )}
        <p>
          <button onClick={toggleSignup}>
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

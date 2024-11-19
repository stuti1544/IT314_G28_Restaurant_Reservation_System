// src/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPassword from './ForgotPassword';
import googleLogo from './images/googlelogo.png';

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userType, setUserType] = useState('customer');
  const [isVerified, setIsVerified] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const usertype = userType === 'owner' ? true : false;
    window.open(`${process.env.REACT_APP_API_URL}/auth/google?type=${usertype}`, '_self');
  };

  useEffect(() => {
    setErrorMessage(null);

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');
    const userTypeParam = params.get('type');
    const verificationToken = params.get('verified');

    // Check if this is a newly registered user requiring verification
    const isNewUser = localStorage.getItem('isNewUser') === 'true';

    if (isNewUser && !verificationToken) {
      setErrorMessage('Please verify your email first. Check your inbox for the verification link.');
      return;
    }

    // If user has verification token, mark as verified
    if (verificationToken) {
      setIsVerified(true);
      localStorage.removeItem('isNewUser'); // Clear the new user flag
    }

    if (userTypeParam) {
      setUserType(userTypeParam);
    }

    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/';
    }

    if (error) {
      setErrorMessage(error);
    }
  }, [location, navigate]);

  // Render unauthorized message if user is new and not verified
  if (localStorage.getItem('isNewUser') === 'true' && !isVerified) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Email Verification Required</h2>
          <p>Please check your email and click the verification link to access your account.</p>
        </div>
      </div>
    );
  }

  if (isForgotPassword) {
    return <ForgotPassword setIsForgotPassword={setIsForgotPassword} userType={userType} />;
  }

  return (
    <div className="login-page">
      {errorMessage && (
        <p className="error-message" style={{ color: 'red', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>
          {errorMessage}
        </p>
      )}
      {userType ? (
        <div className="login-card">
          {isSignup ? (
            <SignupForm 
              userType={userType} 
              onSignupSuccess={() => {
                localStorage.setItem('isNewUser', 'true');
                setIsSignup(false);
              }}
            />
          ) : (
            <>
              <LoginForm 
                userType={userType} 
                isVerified={isVerified}
                setLoginPageError={setErrorMessage}
              />
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
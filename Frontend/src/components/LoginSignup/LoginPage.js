// src/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPassword from './ForgotPassword';
import googleLogo from './images/googlelogo.png';
const {jwtDecode} = require('jwt-decode');

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userType, setUserType] = useState('customer');
  const [isVerified, setIsVerified] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle Google Sign-in
  const handleGoogleLogin = () => {
    const usertype = userType === 'owner' ? true : false;
    window.open(`${process.env.REACT_APP_API_URL}/auth/google?type=${usertype}`, '_self');
  };

  // Effect to handle token and error from URL, reset errorMessage on mount
  useEffect(() => {
    setErrorMessage(null); // Reset error message every time component renders

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');
    const userTypeParam = params.get('type'); // Get userType from URL
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
      setUserType(userTypeParam); // Set userType to state if passed in the URL
    }

    if (token) {
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);
      if(decodedToken.isOwner)
        window.location.href = '/dashboard';

      window.location.href = '/user-dashboard'; // Redirect to home or another page
    }

    if (error) {
      setErrorMessage(error); // Set error message from URL
    }
  }, [location, navigate]);

  // Render unauthorized message if user is new and not verified
  if (localStorage.getItem('isNewUser') === 'true' && !isVerified) {
    return (
      <div className={styles['login-page']}>
        <div className={styles['login-card']}>
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
    <div className={styles['login-page']}>
      {errorMessage && (
        <p className={styles['error-message']} style={{ color: 'red', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>
          {errorMessage}
        </p>)}
      {userType ? (
        <div className={styles['login-card']}>
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
              <div className={styles['login-options']}>
                <a href="#" onClick={() => setIsForgotPassword(true)}>
                  Forgot Password?
                </a>
              </div>
              <button className={styles['google-login-btn']} onClick={handleGoogleLogin}>
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

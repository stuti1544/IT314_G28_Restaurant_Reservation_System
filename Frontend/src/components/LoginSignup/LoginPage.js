// src/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
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
            <SignupForm userType={userType} />
          ) : (
            <>
              <LoginForm userType={userType} />
              <div className={styles['login-options']}>
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

// src/SignupForm.js
import React, { useState } from 'react';
import styles from './SignupForm.module.css';

const SignupForm = ({ userType, onSignupSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage('');
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          isOwner: userType === 'owner',
        }),
      });

      const data = await response.json();
      console.log("sf", data);
      
      if (response.ok) {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        setSuccessMessage(data.message);
        setIsSubmitted(true);
        onSignupSuccess();
      } else {
        setErrorMessage(data.message);
        setSuccessMessage('');
      }
      
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setSuccessMessage('');
    }
  };

  return isSubmitted && successMessage ? (
    <div className={styles['verify-email-container']}>
      <h2>Verify Your Email</h2>
      <p>Click on the link sent to {email} to verify your account.</p>
    </div>
  ) : (
    <div className={styles['signup-form-container']}>
      <h2>{userType === 'customer' ? 'Customer Signup' : 'Restaurant Owner Signup'}</h2>
      <form className={styles['signup-form']} onSubmit={handleSubmit}>
        {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
        {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
        
        <input
          type="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;

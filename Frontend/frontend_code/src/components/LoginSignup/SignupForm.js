// src/SignupForm.js
import React, { useState } from 'react';
import './SignupForm.css';

const SignupForm = ({ userType }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log(`Signing up ${userType} with email: ${email}`);
  };

  return isSubmitted ? (
    <div className="verify-email-container">
      <h2>Verify Your Email</h2>
      <p>Click on the link sent to {email} to verify your account.</p>
    </div>
  ) : (
    <div className="signup-form-container">
      <h2>{userType === 'customer' ? 'Customer Signup' : 'Restaurant Owner Signup'}</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;

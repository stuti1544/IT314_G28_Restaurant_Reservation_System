// src/ForgotPassword.js
import React, { useState } from 'react';
import './ForgotPassword.css';
import PasswordResetConfirmation from './PasswordResetConfirmation';

const ForgotPassword = ({ setIsForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle forgot password process
    alert(`Password reset link sent to ${email}`);
    setIsResetSent(true);
  };

  return isResetSent ? (
    <PasswordResetConfirmation setIsForgotPassword={setIsForgotPassword} />
  ) : (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        <p>
          <button onClick={() => setIsForgotPassword(false)}>Back to Login</button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

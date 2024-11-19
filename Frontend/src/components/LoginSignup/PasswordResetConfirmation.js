// src/PasswordResetConfirmation.js
import React from 'react';
import styles from './PasswordResetConfirmation.module.css';

const PasswordResetConfirmation = ({ setIsForgotPassword }) => {
  return (
    <div className={styles['reset-confirmation-page']}>
      <div className={styles['reset-confirmation-card']}>
        <h2>Reset Link Sent</h2>
        <p>We've sent a password reset link to your email. Please check your inbox.</p>
        <button onClick={() => setIsForgotPassword(false)}>Back to Login</button>
      </div>
    </div>
  );
};

export default PasswordResetConfirmation;

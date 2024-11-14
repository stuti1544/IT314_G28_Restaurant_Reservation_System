import React, { useState } from 'react';
import './ResetPassword.css'; // Import the CSS file for styles
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {token} = useParams();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
          }
          try {
            setSuccessMessage('');
            setErrorMessage('');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password/${token}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ password }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
              setSuccessMessage('Password changed successfully!');
              setPassword('');
              setConfirmPassword('');
            } else {
              setErrorMessage(data.message || 'Unable to reset password. Try again.');
            }
          } catch (error) {
            setErrorMessage('An error occurred. Please try again later.');
          }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-card">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    {/* <div className="input-field">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div> */}
                    <div className="input-field">
                        <input
                            type="password"
                            placeholder="New Password"
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
                    </div>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button type="submit" className="reset-button">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;

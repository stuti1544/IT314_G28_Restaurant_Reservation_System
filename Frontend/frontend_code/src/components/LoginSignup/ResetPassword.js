import React, { useState } from 'react';
import './ResetPassword.css'; // Import the CSS file for styles

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your password reset logic here
        console.log('Email:', email);
        console.log('New Password:', newPassword);
        // Reset the form and handle success/error messages accordingly
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-card">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-field">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button type="submit" className="reset-button">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;

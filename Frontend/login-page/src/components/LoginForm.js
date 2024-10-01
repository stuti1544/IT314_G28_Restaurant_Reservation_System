// src/LoginForm.js
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ userType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log(`Logging in ${userType} with email: ${email}`);
  };

  return (
    <div className="login-form-container">
      <h2>{userType === 'customer' ? 'Customer Login' : 'Restaurant Owner Login'}</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;

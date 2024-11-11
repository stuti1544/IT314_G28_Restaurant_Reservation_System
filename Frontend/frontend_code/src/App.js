// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LoginSignup/LandingPage';
import LoginPage from './components/LoginSignup/LoginPage';
import UserTypeSelection from './components/LoginSignup/UserTypeSelection';
import Dashboard from './components/RestaurantOwner/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* User type selection page */}
        <Route path="/select-user" element={<UserTypeSelection />} />
        
        {/* Dashboard page (add other paths as needed) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Optional: Redirect any unknown paths to landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

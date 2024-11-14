// src/Navbar.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Navbar.css';

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setVisible(false); // Hide on scroll down after 100px
    } else if (currentScrollY < lastScrollY) {
      setVisible(true); // Show on scroll up
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Function to handle the Get Started button click
  const handleGetStarted = () => {
    navigate('/select-user'); // Redirect to user type selection
  };

  return (
    <nav className={`navbar ${visible ? 'visible' : 'hidden'}`}>
      <div className="navbar-brand">
        <h1>Fork and Feast</h1>
      </div>
      <ul className="nav-links">
        <li>
        <button onClick={handleGetStarted} className="button" style={{ color: 'white' }}>
    Get Started
</button>

        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

// src/components/Loader.js
import React from 'react';
import './Loader.css';

const Loader = () => (
  <div className="loader-overlay">
    <img src="/donut.png" alt="Loading..." className="loader-image" />
  </div>
);

export default Loader;

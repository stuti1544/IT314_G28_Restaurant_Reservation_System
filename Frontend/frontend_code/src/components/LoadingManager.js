// src/components/LoadingManager.js
import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Loader from './Loader';

const LoadingManager = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate loading delay
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <Loader />}
      <Outlet /> {/* This renders the matched route's component */}
    </>
  );
};

export default LoadingManager;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl bg-color-background text-color-text">Loading...</div>;
  }

  if (!user) {
    return null; // Or a loading spinner, or redirecting message
  }

  return children;
};

export default ProtectedRoute;
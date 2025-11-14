import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState(null);

  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let authResponse;
      if (isSignUp) {
        authResponse = await supabase.auth.signUp({ email, password });
      } else {
        authResponse = await supabase.auth.signInWithPassword({ email, password });
      }

      const { error } = authResponse;

      if (error) {
        throw error;
      } else if (isSignUp) {
        setMessage('Check your email for the confirmation link!');
      } else {
        setMessage('Logged in successfully!');
      }
    } catch (error) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md card space-y-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-text text-base">
            {isSignUp ? 'Join CampusPlanner today!' : 'Sign in to continue to CampusPlanner'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white/80 text-text placeholder-gray-400 px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary/60"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white/80 text-text placeholder-gray-400 px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary/60"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="relative flex justify-center text-sm my-4">
          <span className="px-4 bg-background text-text">Or continue with</span>
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center py-3 px-4 rounded-lg border border-gray-300 bg-white/80 text-text hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <img src="/google-icon.svg" alt="Google icon" className="h-5 w-5 mr-3" />
          Sign {isSignUp ? 'up' : 'in'} with Google
        </button>

        <p className="text-center text-sm text-text">
          {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-primary hover:text-accent focus:outline-none focus:underline bg-transparent"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        {message && <p className="mt-4 text-center text-red-600 text-sm">{message}</p>}
      </div>
    </div>
);
};

export default AuthPage;
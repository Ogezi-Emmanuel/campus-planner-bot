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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('type') === 'password-reset') {
      setIsPasswordReset(true);
    } else if (queryParams.get('form') === 'signup') {
      setIsSignUp(true);
    }
  }, [user, navigate]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let authResponse;
      if (isSignUp) {
        // For sign-up, send a verification email and redirect to the app's base URL
        authResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin, // Use environment variable for production URL
          },
        });
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

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=password-reset`,
      });

      if (error) {
        throw error;
      }
      setMessage('Check your email for a password reset link!');
      setShowForgotPassword(false);
    } catch (error) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return ''; // No error
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      setLoading(false);
      return;
    }

    const validationMessage = validatePassword(newPassword);
    if (validationMessage) {
      setPasswordError(validationMessage);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }
      setMessage('Password updated successfully! You can now sign in.');
      setIsPasswordReset(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md card space-y-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">
            {isPasswordReset ? 'Set New Password' : (showForgotPassword ? 'Reset Your Password' : (isSignUp ? 'Create an Account' : 'Welcome Back'))}
          </h2>
          <p className="text-text text-base">
            {isPasswordReset ? 'Enter your new password.' : (showForgotPassword ? 'Enter your email to receive a password reset link.' : (isSignUp ? 'Join CampusPlanner today!' : 'Sign in to continue to CampusPlanner'))}
          </p>
        </div>

        {isPasswordReset ? (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-text mb-1">New Password</label>
              <input
                type="password"
                id="new-password"
                className="mt-1 block w-full rounded-lg border border-border bg-background/80 text-text placeholder-lightText px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary/60"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError('');
                }}
                required
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-text mb-1">Confirm New Password</label>
              <input
                type="password"
                id="confirm-password"
                className="mt-1 block w-full rounded-lg border border-border bg-background/80 text-text placeholder-lightText px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary/60"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        ) : showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-lg border border-border bg-background/80 text-text placeholder-lightText px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary/60"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="btn-secondary w-full mt-2"
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-lg border border-border bg-background/80 text-text placeholder-lightText px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary/60"
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
                className="mt-1 block w-full rounded-lg border border-border bg-background/80 text-text placeholder-lightText px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary/60"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-primary hover:text-accent focus:outline-none focus:underline bg-transparent"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-center text-accent text-sm">{message}</p>}

        {!isPasswordReset && !showForgotPassword && (
          <div className="text-center mt-4">
            {isSignUp ? (
              <p className="text-text">
                Already have an account? {' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-text">
                Don't have an account? {' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
);
};

export default AuthPage;
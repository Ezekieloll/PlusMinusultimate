import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Auth.css';
import './Pattern.css';

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`auth-page-wrapper ${animate ? 'animate' : ''}`}>
      <div className="auth-card-container">
        <div className="left-side">
          {/* Add the logo in the left-side pattern */}
          <img
  src="/PlusMinus-removebg-preview.png"
  alt="Logo"
  className="logo"
  style={{ width: '300px', height: '300px' }}
/>
        </div>
        <div className="right-side">
          <div className="auth-card">
            <h1 className="auth-title">{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="auth-subtitle">{isRegistering ? 'Start your journey' : 'Sign in to continue'}</p>

            <form className="auth-form" onSubmit={handleAuth}>
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <p className="error-message">{error}</p>}

              <button type="submit" className="submit-btn">
                {isRegistering ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="toggle-auth">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="toggle-btn"
              >
                {isRegistering ? 'Sign In' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pattern-container"></div>
    </div>
  );
}

export default Auth;

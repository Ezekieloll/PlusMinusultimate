// src/components/Auth.js
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  
  // For "Forgot Password"
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Handle Sign In
  const handleSignIn = async () => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Register
  const handleRegister = async () => {
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setEmail("");
    setPassword("");
  };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    setError("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert(`Password reset email sent to ${resetEmail}`);
      setResetEmail("");
      setShowResetForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {user ? (
        <div>
          <h2 className="text-xl font-bold mb-2">Welcome, {user.email}</h2>
          <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded">
            Sign Out
          </button>
        </div>
      ) : (
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            {isRegistering ? "Register" : "Sign In"}
          </h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}

          {!showResetForm ? (
            <>
              {/* Email & Password Inputs */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border mb-2 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border mb-2 rounded"
              />

              {/* Sign In or Register Button */}
              <button
                onClick={isRegistering ? handleRegister : handleSignIn}
                className="w-full py-2 bg-blue-500 text-white rounded"
              >
                {isRegistering ? "Register" : "Sign In"}
              </button>

              {/* Toggle between Sign In / Register */}
              <p className="mt-2 text-sm">
                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <span
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError("");
                  }}
                  className="text-blue-500 cursor-pointer"
                >
                  {isRegistering ? "Sign In" : "Register"}
                </span>
              </p>

              {/* Forgot Password Link */}
              {!isRegistering && (
                <p className="mt-2 text-sm text-blue-500 cursor-pointer"
                   onClick={() => setShowResetForm(true)}>
                  Forgot Password?
                </p>
              )}
            </>
          ) : (
            <>
              {/* Reset Password Form */}
              <h3 className="text-lg font-semibold mb-2">Reset Password</h3>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full p-2 border mb-2 rounded"
              />
              <button
                onClick={handlePasswordReset}
                className="w-full py-2 bg-blue-500 text-white rounded"
              >
                Send Reset Email
              </button>
              <p className="mt-2 text-sm text-blue-500 cursor-pointer"
                 onClick={() => {
                   setShowResetForm(false);
                   setError("");
                 }}>
                Back to {isRegistering ? "Register" : "Sign In"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Auth;

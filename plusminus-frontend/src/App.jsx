// src/App.jsx
// src/App.jsx
/*import React from 'react';
import Dashboard from './Dashboard';

function App() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default App;*/

import React, { useContext } from 'react';
import { AuthContext, AuthProvider } from './AuthContext';
import Auth from './components/Auth';
import Dashboard from './Dashboard';

function AppContent() {
  const { user } = useContext(AuthContext);
  return <div>{user ? <Dashboard /> : <Auth />}</div>;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

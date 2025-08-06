import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast"

// Import your pages/components
import Home from './pages/Homepage'; // Main chat page
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';

function App() {
  const isAuthenticated = true; //redux state here

  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
	  <Toaster position="top-right" reverseOrder={false} />
    </Router>

  );
}

export default App;

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  redirect,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

import Home from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';

import { logout, setCurrentUser } from './redux/slices/authSlice';
import ProtectedRoute from './utils/ProtectedRoute';

// Optional: You can create a routes.js later for route constants
const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/',
  PROFILE: '/profile',
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5000/auth/whoami', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        // console.log(data);  //works fine
        if (res.ok && data) {
          dispatch(setCurrentUser(data));
        } else {
          // dispatch(logout());
          // no need to llogout
          toast.error("data: ",data)
        }
      } catch (err) {
        toast.error('Auth check failed:', err);
        console.error('Auth check failed:', err);
        // dispatch(logout());

        redirect("/")
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <Router>
      {/* Toast messages */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Application Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

import Home from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';

import { logout, setCurrentUser } from './redux/slices/authSlice';
import ProtectedRoute from './utils/ProtectedRoute';
import { connectSocket, disconnectSocket, socket } from './socket';
import { getToken } from 'firebase/messaging';
import { messaging } from './firebase';

const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/',
  PROFILE: '/profile',
};

function App() {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Authentication check - only run once
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(setCurrentUser(null));
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/auth/whoami`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        
        if (res.ok && data) {
          dispatch(setCurrentUser(data));
        } else {
          dispatch(setCurrentUser(null));
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        dispatch(setCurrentUser(null));
        localStorage.removeItem('token');
      }
    };

    fetchUser();
  }, [dispatch, BACKEND_URL]);

  // FCM Token registration - only when currentUser is available
  useEffect(() => {
    const registerFCMToken = async () => {
      if (!currentUser?._id) return;
      
      try {
        const fcmToken = await getToken(messaging, {
          vapidKey: "BDJ1f52yL1uuOMmAwarpixhR6LGMygQ8gQaNCwW5AG3Zko4nAHfWvqrMkDglVDNuXsPsWbS9RhKiXA4BPJq9I-U"
        });

        if (fcmToken && socket) {
          socket.emit("register_fcm_token", { 
            userId: currentUser._id, 
            fcmToken 
          });
        }
      } catch (err) {
        console.error("Error fetching FCM token:", err);
      }
    };

    registerFCMToken();
  }, [currentUser?._id]);

  // Socket connection - only when authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser?._id) {
      if (!socket.connected) {
        connectSocket(currentUser._id);
      }
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, currentUser?._id]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />

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

        <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
      </Routes>
    </>
  );
}

export default App;
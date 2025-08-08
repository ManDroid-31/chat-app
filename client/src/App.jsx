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
  const { currentUser } = useSelector((state) => state.auth)
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/auth/whoami';
  // set currentUser
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(BACKEND_URL, {
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
          toast.error("data: ", data)
        }
      } catch (err) {
        toast.error('Auth check failed');
        console.error('Auth check failed:', err);
        navigate('/');
      }
    };

    fetchUser();
  }, [dispatch, navigate]);



    useEffect(() => {
    const fetchToken = async () => {
      try {
        const fcmToken = await getToken(messaging, {
          vapidKey: "BDJ1f52yL1uuOMmAwarpixhR6LGMygQ8gQaNCwW5AG3Zko4nAHfWvqrMkDglVDNuXsPsWbS9RhKiXA4BPJq9I-U"
        });

        if (fcmToken) {
          const userId = currentUser?._id
          socket.emit("register_fcm_token", { userId, fcmToken });
          // console.log("socket called");
        }
      } catch (err) {
        console.error("Error fetching FCM token:", err);
      }
    };

    fetchToken();
  }, [currentUser]);


  useEffect(() => {
    if (!socket.connected && currentUser?._id) {
      connectSocket(currentUser._id);
    }
    return () => {
      disconnectSocket();
    };
  }, [currentUser?._id]);

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

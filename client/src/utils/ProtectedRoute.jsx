// utils/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  if (currentUser === undefined) {
    return <div>Loading...</div>;
  }

  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

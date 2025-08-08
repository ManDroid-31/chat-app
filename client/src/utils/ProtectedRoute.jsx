// utils/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const { currentUser } = useSelector((state) => state.auth);

  if (currentUser === undefined) {
    return <div>Loading...</div>;
  }


  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

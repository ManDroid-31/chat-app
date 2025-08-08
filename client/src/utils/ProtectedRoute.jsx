import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  if (currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }


  if (!token || !currentUser || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
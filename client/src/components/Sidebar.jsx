import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../redux/slices/authSlice';
import { selectUser as setSelectedUser } from '../redux/slices/chatSlice';
import { socket } from '../socket';

function Sidebar({ onUserSelect }) {
  const dispatch = useDispatch();
  const { users, loading, currentUser, isAuthenticated } = useSelector(state => state.auth);
  const { selectedUser } = useSelector(state => state.chat);

  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  
  useEffect(() => {
    if (isAuthenticated && currentUser?._id && users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isAuthenticated, currentUser?._id, users.length]);

  const getFilteredUsers = useCallback(() => {
    if (!users) return [];
    return users
      .map(user => ({
        ...user,
        isOnline: onlineUsers.includes(user._id),
      }))
      .filter(user => {
        const matchesSearch = user.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const onlineFilter = !showOnlineOnly || user.isOnline;
        return matchesSearch && onlineFilter;
      });
  }, [users, onlineUsers, searchQuery, showOnlineOnly]);

  const handleUserSelect = useCallback((user) => {
    dispatch(setSelectedUser(user));
    if (onUserSelect) onUserSelect(user);
  }, [dispatch, onUserSelect]);

  const toggleOnlineFilter = useCallback(() => {
    setShowOnlineOnly(prev => !prev);
  }, []);

  const isUserSelected = useCallback((user) => {
    return selectedUser?._id === user._id;
  }, [selectedUser?._id]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (userIds) => {
      setOnlineUsers(userIds || []);
    };

    socket.on("take-online-users", handleOnlineUsers);

    return () => {
      socket.off("take-online-users", handleOnlineUsers);
    };
  }, []);

  const filteredUsers = getFilteredUsers();

  if (loading && users.length === 0) {
    return (
      <aside className="bg-white my-4 p-4 shadow-2xl hover:shadow-purple-500 transition flex flex-col rounded-r-2xl w-full">
        <div className="bg-purple-600 text-white rounded-xl px-4 py-3 font-semibold text-xl flex items-center gap-3 justify-center mb-4">
          <img src="/message-app.png" alt="logo" className="w-6 h-6" />
          <span>MessageMe</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-gray-500">Loading users...</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white my-4 p-4 shadow-2xl hover:shadow-purple-500 transition flex flex-col rounded-r-2xl w-full">
      
      <div className="bg-purple-600 text-white rounded-xl px-4 py-3 font-semibold text-xl flex items-center gap-3 justify-center mb-4">
        <img src="/message-app.png" alt="logo" className="w-6 h-6" />
        <span>MessageMe</span>
      </div>

      
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search a colleague"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      
      <div className="mb-4 text-sm text-gray-700 flex items-center justify-between">
        <label htmlFor="onlineToggle">Show Online Only</label>
        <button
          id="onlineToggle"
          onClick={toggleOnlineFilter}
          className={`px-3 py-1 rounded-xl font-medium transition ${
            showOnlineOnly ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {showOnlineOnly ? 'On' : 'Off'}
        </button>
      </div>

      
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                isUserSelected(user)
                  ? 'bg-purple-100 border-l-4 border-purple-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              <img
                src={user.avatar_url}
                className="w-10 h-10 rounded-full object-cover"
                alt={user.username}
                loading="lazy"
              />
              <div className="flex-1">
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.role || 'Member'}</p>
              </div>
              <span
                className={`h-3 w-3 rounded-full ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">
            {loading ? 'Loading users...' : 'No users found.'}
          </p>
        )}
      </div>
    </aside>
  );
}

export default React.memo(Sidebar);
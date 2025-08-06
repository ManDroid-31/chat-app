import React, { useState } from 'react';

const mockUsers = [
  { id: '1', name: 'Sachin', role: 'Designer', isOnline: true, avatar: 'https://i.pravatar.cc/40?img=1' },
  { id: '2', name: 'Gunjan', role: 'Developer', isOnline: false, avatar: 'https://i.pravatar.cc/40?img=2' },
  { id: '3', name: 'Tanmay', role: 'Manager', isOnline: true, avatar: 'https://i.pravatar.cc/40?img=3' },
  { id: '4', name: 'Taniesha', role: 'HR', isOnline: false, avatar: 'https://i.pravatar.cc/40?img=4' },
  { id: '5', name: 'Vineetha', role: 'QA', isOnline: true, avatar: 'https://i.pravatar.cc/40?img=5' },
  { id: '6', name: 'Gauri', role: 'Intern', isOnline: false, avatar: 'https://i.pravatar.cc/40?img=6' },
  { id: '7', name: 'Gauri', role: 'Intern', isOnline: false, avatar: 'https://i.pravatar.cc/40?img=6' },
  { id: '8', name: 'Gauri', role: 'Intern', isOnline: false, avatar: 'https://i.pravatar.cc/40?img=6' },
  { id: '9', name: 'Gauri', role: 'Intern', isOnline: false, avatar: 'https://i.pravatar.cc/40?img=6' },
  { id: '10', name: 'Gauri', role: 'Intern', isOnline: false, avatar: 'https://i.pravatar.cc/40?img=6' },
  { id: '11', name: 'Gauri', role: 'Intern', isOnline: false, avatar: 'https://i.pravatar.cc/40?img=6' },
];

function Sidebar() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnlineOnly, setIsOnlineOnly] = useState(false);

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!isOnlineOnly || user.isOnline)
  );

  return (
    <aside className="w-[22%] bg-white my-4 p-4 shadow-2xl hover:shadow-purple-500 transition flex flex-col rounded-r-2xl">

{/* logo */}
      <div className="bg-purple-600 text-white rounded-xl px-4 py-3 font-semibold text-xl flex items-center gap-3 justify-center mb-4">
        <img src="/message-app.png" alt="logo" className="w-6 h-6" />
        <span>MessageMe</span>
      </div>


      {/* searchbox */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search a colleague"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      
      {/* filter */}
      <div className="mb-4 text-sm text-gray-700 flex items-center justify-between">
        <label htmlFor="toggleOnline">Show Online Only</label>
        <button
          id="toggleOnline"
          onClick={() => setIsOnlineOnly(!isOnlineOnly)}
          className={`px-3 py-1 rounded-xl font-medium transition ${
            isOnlineOnly ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isOnlineOnly ? 'On' : 'Off'}
        </button>
      </div>

      
      {/* user list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                selectedUserId === user.id
                  ? 'bg-purple-100 border-l-4 border-purple-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              <img
                src={user.avatar}
                className="w-10 h-10 rounded-full object-cover"
                alt={user.name}
              />
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>

              <span
                className={`h-3 w-3 rounded-full ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
              ></span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">No users found.</p>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

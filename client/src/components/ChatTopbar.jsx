import React from "react";

function ChatTopbar({ selectedUser }) {
  if (!selectedUser) return null;

  return (
    <div className="w-full bg-gray-100 px-6 py-3 flex items-center justify-between rounded-t-xl shadow">
      <div className="flex items-center gap-3">
        <img src={selectedUser.avatar_url} alt={selectedUser.name} className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="text-lg font-semibold">{selectedUser.username}</h2>
          <p className={`text-sm ${selectedUser.isOnline ? "text-green-600" : "text-gray-500"}`}>
            {selectedUser.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatTopbar;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setOnline] = useState(navigator.onLine);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({ username: '', bio: '', avatar_url: '' });
  const [avatars, setAvatars] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first");
        return navigate("/login");
      }

      try {
        const res = await fetch("http://localhost:5000/auth/whoami", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setUser(data);
          setFormData({
            username: data.username,
            avatar_url: data.avatar_url,
            bio: data.bio || '',
          });
        } else {
          toast.error(data.message || "Failed to fetch user");
          navigate("/login");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Server error");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/getAvatars");
        const data = await res.json();
        if (Array.isArray(data)) setAvatars(data);
      } catch (err) {
        console.error("Avatar fetch failed", err);
      }
    };

    if (editable) fetchAvatars();
  }, [editable]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token expired");

    try {
      const res = await fetch("http://localhost:5000/auth/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setEditable(false);
        toast.success("Profile updated");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Server error: ",err.message);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;
  if (!user) return null;

  return (
    <div className="h-screen w-full bg-gray-100 p-8 flex flex-col items-center">


      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-purple-600">👤 My Profile</h1>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:cursor-pointer hover:bg-purple-700 transition"
          onClick={() => navigate("/")}
        >
          Back to Chat
        </button>
      </div>



      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center gap-6">
        <img
          src={formData.avatar_url}
          alt={formData.username}
          className="w-32 h-32 rounded-full border-4 border-purple-500"
        />


        <div className="text-center space-y-2 w-full">
          {editable ? (
            <>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border px-4 py-2 rounded-lg text-center"
              />
              <textarea
                placeholder="Your bio..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full border px-4 py-2 rounded-lg text-center resize-none"
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              {user.bio && (
                <p className="text-sm px-3 py-1 bg-purple-100 text-purple-600 rounded-full inline-block">
                  {user.bio}
                </p>
              )}
            </>
          )}
        </div>



        {editable && avatars.length > 0 && (
          <div className="w-full text-left">
            <p className="mb-2 text-gray-700 font-medium">Choose Avatar</p>
            <div className="grid grid-cols-6 gap-2">
              {avatars.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`avatar-${idx}`}
                  onClick={() => setFormData({ ...formData, avatar_url: url })}
                  className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                    formData.avatar_url === url ? "border-purple-600 scale-110" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        )}



        <div>
          <span
            className={`inline-block w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
          ></span>
          <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
        </div>


        {editable ? (
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:cursor-pointer hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setFormData({ username: user.username, avatar_url: user.avatar_url, bio: user.bio || '' });
                setEditable(false);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditable(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:cursor-pointer hover:bg-purple-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default UserProfile;

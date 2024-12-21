import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: { street: "", city: "", zipCode: "" },
    dateOfBirth: "",
    profileImage: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:4000/api/user/profile", {
          headers: { token },
        });
        if (response.data.success) {
          setProfileData(response.data.user);
        } else {
          setMessage(response.data.message || "Failed to fetch profile.");
        }
      } catch (error) {
        console.error(error);
        setMessage("An error occurred while fetching profile information.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.put(
        "http://localhost:4000/api/user/profile",
        profileData,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        setMessage("Profile updated successfully.");
        setIsEditing(false);
      } else {
        setMessage(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while updating profile.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center">Your Profile</h1>
      {message && <div className="mb-4 text-center text-red-500">{message}</div>}

      {!isEditing ? (
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full shadow-md"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <strong className="block text-gray-700">Phone:</strong>
              <span>{profileData.phone || "Not Provided"}</span>
            </div>
            <div>
              <strong className="block text-gray-700">Date of Birth:</strong>
              <span>
                {profileData.dateOfBirth
                  ? new Date(profileData.dateOfBirth).toLocaleDateString()
                  : "Not Provided"}
              </span>
            </div>
            <div className="col-span-2">
              <strong className="block text-gray-700">Address:</strong>
              <span>
                {`${profileData.address.street}, ${profileData.address.city}, ${profileData.address.zipCode}`}
              </span>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profileData.dateOfBirth?.split("T")[0] || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Profile Image URL</label>
              <input
                type="text"
                name="profileImage"
                value={profileData.profileImage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Street</label>
            <input
              type="text"
              name="address.street"
              value={profileData.address.street}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700">City</label>
              <input
                type="text"
                name="address.city"
                value={profileData.address.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Zip Code</label>
              <input
                type="text"
                name="address.zipCode"
                value={profileData.address.zipCode}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import avatarImage from "../assets/user.jpg"; // Đảm bảo đường dẫn đúng

import "../styles/profile.css";

function Profile() {
  const [userData, setUserData] = useState({
    name: "John Doe",
    username: "@johndoe",
    bio: "This is a short bio about John Doe.",
    avatarUrl: avatarImage, // Sử dụng avatar đã import
    backgroundImageUrl: "https://via.placeholder.com/1200x400",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);

  // Lấy dữ liệu người dùng khi component được load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/user/userProfile/1`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  // Cập nhật ảnh đại diện
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", 1); // Cập nhật userId thực tế

    try {
      const response = await axios.put(
        "/user/userProfile/update/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData({ ...userData, avatarUrl: response.data }); // Cập nhật URL avatar mới
      setAvatarFile(null);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  // Cập nhật ảnh nền
  const handleBackgroundChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", 1); // Cập nhật userId thực tế

    try {
      const response = await axios.put(
        "/user/userProfile/update/backgroundImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData({ ...userData, backgroundImageUrl: response.data });
      setBackgroundFile(null);
    } catch (error) {
      console.error("Error uploading background image:", error);
    }
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-background">
          <img
            src={userData.backgroundImageUrl}
            alt="Background"
            className="background-image"
          />
          <input
            type="file"
            className="background-upload"
            onChange={handleBackgroundChange}
            accept="image/*"
          />
        </div>
        <div className="profile-avatar">
          <img
            src={userData.avatarUrl} // Đây là ảnh avatar
            alt="Avatar"
            className="avatar-image"
          />
          <input
            type="file"
            className="avatar-upload"
            onChange={handleAvatarChange}
            accept="image/*"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        <h1>{userData.name}</h1>
        <p>{userData.username}</p>
        <p>{userData.bio}</p>
      </div>

      {/* Profile Posts */}
      <div className="profile-posts">
        {/* Example Post */}
        <div className="post">
          <p>
            <strong>{userData.name}</strong> - 2 hours ago
          </p>
          <p>This is a sample post on my profile!</p>
        </div>
        <div className="post">
          <p>
            <strong>{userData.name}</strong> - 1 day ago
          </p>
          <p>Another post, just to make things more interesting.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;

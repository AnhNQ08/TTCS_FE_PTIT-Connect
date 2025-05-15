import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/profile.css";

import userAvatar from "../assets/user.jpg";
import background from "../assets/background.jpg";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "Quang Anh",
    username: "@anhnq.22cn030",
    bio: "This is a short bio about Quang Anh.",
    avatarUrl: userAvatar,
    backgroundImageUrl: background,
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      setUserData({ ...userData, avatarUrl });
    }
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const backgroundImageUrl = URL.createObjectURL(file);
      setUserData({ ...userData, backgroundImageUrl });
    }
  };

  return (
    <div className="homepage-container">
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-background">
            <img
              src={userData.backgroundImageUrl}
              alt="Background"
              className="background-image"
            />
            <label
              htmlFor="backgroundUpload"
              className="custom-upload-btn btn-background"
            >
              Đổi ảnh nền
            </label>
            <input
              id="backgroundUpload"
              type="file"
              onChange={handleBackgroundChange}
              accept="image/*"
            />
          </div>

          <div className="profile-avatar">
            <img
              src={userData.avatarUrl}
              alt="Avatar"
              className="avatar-image"
            />
            <label
              htmlFor="avatarUpload"
              className="custom-upload-btn btn-avatar"
            >
              Thay ảnh đại diện
            </label>
            <input
              id="avatarUpload"
              type="file"
              onChange={handleAvatarChange}
              accept="image/*"
            />
          </div>
        </div>

        <div className="profile-info">
          <h1>{userData.name}</h1>
          <p>{userData.username}</p>
          <p>{userData.bio}</p>
        </div>

        <div className="profile-posts">
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
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/profile.css";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const userId = 1;

  useEffect(() => {
    axios
      .get(`/user/userProfile/${userId}`)
      .then((res) => setUserProfile(res.data))
      .catch((err) => console.error("Lỗi lấy profile:", err));
  }, [userId]);

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${userProfile.backgroundImage})` }}
      />
      <div className="profile-header">
        <div className="profile-info">
          <img src={userProfile.avatar} alt="Avatar" className="avatar" />
          <div className="user-details">
            <h2>{userProfile.name}</h2>
            <p>{userProfile.jobTitle}</p>
            <button>Edit Profile</button>
          </div>
        </div>
      </div>
      <div className="profile-content">
        <h3>About Me</h3>
        <p>{userProfile.bio}</p>
        <div className="profile-tabs">
          <button className="tab">Posts</button>
          <button className="tab">Friends</button>
          <button className="tab">Photos</button>
        </div>
        <div className="profile-posts">
          <h4>Recent Posts</h4>
          <div className="post-box">
            <p>Người dùng chưa có bài viết nào.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

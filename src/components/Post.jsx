import React from "react";

const Post = () => {
  return (
    <div className="post">
      <div className="post-header">
        <img
          className="avatar"
          src="https://via.placeholder.com/40"
          alt="avatar"
        />
        <span className="username">Nguyễn Văn A</span>
      </div>
      <div className="post-content">
        <p>Hôm nay trời đẹp quá!</p>
        <img
          className="post-img"
          src="https://via.placeholder.com/300x150"
          alt="post content"
        />
      </div>
    </div>
  );
};

export default Post;

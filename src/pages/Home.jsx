import React from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";
import userAvatar from "../assets/user.jpg";
import Header from "../components/Header.jsx";
import {
  ThumbsUp,
  MessageCircle,
  Share,
  Clock,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [posts] = React.useState([
    {
      id: 1,
      user: "Nguyễn Quang Anh",
      content: "Đây là bài viết đầu tiên của tôi trên PTIT CONNECT!",
      time: "2 giờ trước",
      avatar: userAvatar,
      likes: 10,
      comments: 2,
      shares: 1,
    },
    {
      id: 2,
      user: "Phan Văn Biên",
      content: "Chúc mọi người ngày mới vui vẻ!",
      time: "4 giờ trước",
      avatar: userAvatar,
      image: "https://placehold.co/600x400/EEE/31343C",
      likes: 5,
      comments: 1,
      shares: 0,
    },
    {
      id: 3,
      user: "Hứa Duy Anh",
      content: "Hôm nay mình đã học được rất nhiều điều mới!",
      time: "1 ngày trước",
      avatar: userAvatar,
      likes: 20,
      comments: 5,
      shares: 3,
    },
  ]);

  return (
    <div className="homepage-container">
      <Header />
      <main className="main-content">
        <div className="news-feed">
          <div className="create-post-box">
            <Link to="/add-post">
              <div className="create-post-header">
                <img src={userAvatar} alt="Bạn" className="avatar" />
                <textarea
                  placeholder="Bạn đang nghĩ gì?"
                  rows="3"
                  className="post-input"
                  readOnly
                />
              </div>
              <div className="create-post-actions">
                <Button variant="outline" className="post-button">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tạo bài viết
                </Button>
              </div>
            </Link>
          </div>

          {/* Posts Feed */}
          {posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <div className="user-info">
                  <img src={post.avatar} alt={post.user} className="avatar" />
                  <Link to={`/profile/${post.user}`} className="user-name-link">
                    {" "}
                    {/* Thêm class ở đây */}
                    <span className="user-name">{post.user}</span>
                  </Link>
                </div>
                <span className="post-time">
                  <Clock className="inline-block mr-1 h-4 w-4" />
                  {post.time}
                </span>
              </div>
              <div className="post-content">
                <p>{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="Post" className="post-image" />
                )}
              </div>
              <div className="post-actions">
                <Button variant="ghost" className="action-button">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {post.likes} Thích
                </Button>
                <Button variant="ghost" className="action-button">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.comments} Bình luận
                </Button>
                <Button variant="ghost" className="action-button">
                  <Share className="mr-2 h-4 w-4" />
                  {post.shares} Chia sẻ
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} PTIT CONNECT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

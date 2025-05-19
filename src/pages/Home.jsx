import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";
import userAvatar from "../assets/user.jpg";
import picture from "../assets/background.jpg";
import Header from "../components/Header.jsx";
import {
  ThumbsUp,
  MessageCircle,
  Share,
  Clock,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";

const HomePage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Nguyễn Quang Anh",
      content: "Đây là bài viết đầu tiên của tôi trên PTIT CONNECT!",
      time: "2 giờ trước",
      avatar: userAvatar,
      likes: 10,
      comments: [
        { id: 101, user: "Trần Văn A", text: "Bài viết hay quá!" },
        {
          id: 102,
          user: "Lê Thị B",
          text: "Chào mừng bạn đến với PTIT CONNECT!",
        },
      ],
      shares: 1,
    },
    {
      id: 2,
      user: "Phan Văn Biên",
      content: "Chúc mọi người ngày mới vui vẻ!",
      time: "4 giờ trước",
      avatar: userAvatar,
      image: picture,
      likes: 5,
      comments: [],
      shares: 0,
    },
    {
      id: 3,
      user: "Hứa Duy Anh",
      content: "Hôm nay mình đã học được rất nhiều điều mới!",
      time: "1 ngày trước",
      avatar: userAvatar,
      likes: 20,
      comments: [
        { id: 201, user: "Nguyễn Văn C", text: "Chúc mừng bạn!" },
        { id: 202, user: "Trần Thị D", text: "Mình cũng vậy!" },
        { id: 203, user: "Hứa Duy Anh", text: "Cảm ơn các bạn!" },
      ],
      shares: 3,
    },
  ]);

  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});

  const toggleComments = (postId) => {
    setExpandedComments((prevExpanded) => ({
      ...prevExpanded,
      [postId]: !prevExpanded[postId],
    }));
  };

  const handleAddComment = (postId) => {
    const commentText = newComments[postId];
    if (commentText) {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              { id: Date.now(), user: "Bạn", text: commentText },
            ],
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
    }
  };

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

          {posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <div className="user-info">
                  <img src={post.avatar} alt={post.user} className="avatar" />
                  <Link to={`/profile/${post.user}`} className="user-name-link">
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
                <Button
                  variant="ghost"
                  className="action-button"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.comments.length} Bình luận
                </Button>
                <Button variant="ghost" className="action-button">
                  <Share className="mr-2 h-4 w-4" />
                  {post.shares} Chia sẻ
                </Button>
              </div>
              {expandedComments[post.id] && (
                <div className="comments-section">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <p>
                        <strong>{comment.user}: </strong>
                        {comment.text}
                      </p>
                    </div>
                  ))}
                  <div className="comment-input-area">
                    <Input
                      type="text"
                      placeholder="Viết bình luận..."
                      value={newComments[post.id] || ""}
                      onChange={(e) =>
                        setNewComments((prevNewComments) => ({
                          ...prevNewComments,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddComment(post.id);
                        }
                      }}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddComment(post.id)}
                    >
                      Đăng
                    </Button>
                  </div>
                </div>
              )}
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

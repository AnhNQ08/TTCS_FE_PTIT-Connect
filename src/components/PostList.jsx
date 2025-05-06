import { useEffect, useState } from "react";
import axios from "axios";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:8080/api/posts");
    setPosts(res.data);
  };

  const handleLike = async (postId) => {
    await axios.post(`http://localhost:8080/api/posts/${postId}/like?userId=1`);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <div className="post-header">
            <div className="user-info">
              <img src="src/assets/user.jpg" alt="User" className="avatar" />
              <span className="user-name">{post.user.username}</span>
            </div>
            <span className="post-time">Vài phút trước</span>
          </div>
          <div className="post-content">
            <p>{post.content}</p>
          </div>
          <div className="post-actions">
            <button onClick={() => handleLike(post.id)}>
              Thích ({post.likeCount})
            </button>
            <button>Bình luận</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostList;

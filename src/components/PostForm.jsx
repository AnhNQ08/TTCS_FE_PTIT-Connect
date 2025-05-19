import { useState } from "react";
import axios from "axios";

const PostForm = ({ onPostSuccess }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      await axios.post("http://localhost:8080/api/posts", {
        userId: 1,
        content,
      });
      setContent("");
      onPostSuccess?.();
    } catch (err) {
      console.error("Lỗi khi đăng bài:", err);
    }
  };

  return (
    <div className="post-box">
      <textarea
        placeholder="Bạn đang nghĩ gì?"
        rows="4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSubmit}>Đăng</button>
    </div>
  );
};

export default PostForm;

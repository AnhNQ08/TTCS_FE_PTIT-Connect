import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Image as ImageIcon, XCircle, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import "../styles/AddPost.css";
import Header from "../components/Header.jsx";

const AddPostPage = () => {
  const [currentUser, setCurrentUser] = useState({
    id: 0,
    username: "",
    avatar: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [isColor, setColor] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [content, setContent] = useState("");

  const colorMap = [
    { name: "color1", value: "linear-gradient(to bottom, #686de0, #485470)" },
    { name: "color2", value: "linear-gradient(to bottom, #ff6b6b, #556b2f)" },
    { name: "color3", value: "linear-gradient(to bottom, #48dbfb, #2c3e50)" },
    { name: "color4", value: "linear-gradient(to bottom, #a78bfa, #614ad6)" },
    { name: "color5", value: "linear-gradient(to bottom, #f9a8d4, #b042b4)" },
    { name: "color6", value: "linear-gradient(to bottom, #81c784, #388e3c)" },
  ];

  const handleColorToggle = () => {
    setColor((prev) => !prev);
    if (backgroundColor) {
      setBackgroundColor(null);
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (content === "" && selectedImages.length === 0) {
      alert("Bạn cần thêm nội dung hoặc ảnh cho bài viết!");
      return;
    }

    console.log("Posting with:", { content, selectedImages, backgroundColor });
    alert("Bài viết đã được đăng (giả lập). Vui lòng tích hợp API thật.");
    setContent("");
    setSelectedImages([]);
    setBackgroundColor(null);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && typeof e.target.result === "string") {
            newImages.push(e.target.result);
            if (newImages.length === files.length) {
              setSelectedImages((prevImages) => [...prevImages, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  useEffect(() => {
    // Simulate fetching current user
    const simulatedUser = {
      id: 1,
      username: "testuser",
      avatar: "/avatar.jpg", // provide a valid path
    };
    setCurrentUser(simulatedUser);
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="add-post-header">
        <Button variant="ghost" className="back-button">
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
        <h1 className="header-title">Tạo bài viết</h1>
        <Button onClick={handlePost} className="post-button">
          Đăng
        </Button>
      </div>
      <div className="user-info">
        <img src={currentUser.avatar} alt="Avatar" className="avatar" />
        <span className="username">{currentUser.username}</span>
      </div>
      <div
        className="post-content"
        style={{ backgroundColor: backgroundColor || "transparent" }}
      >
        <Textarea
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={cn("text-area", backgroundColor && "text-white")}
        />
      </div>
      {!isColor && selectedImages.length === 0 && (
        <Button
          variant="ghost"
          onClick={handleColorToggle}
          className="color-button"
        >
          <Palette className="mr-2 h-4 w-4" />
          Màu nền
        </Button>
      )}
      {isColor && (
        <div className="background-color-container">
          <Button
            variant="ghost"
            onClick={handleColorToggle}
            className="back-button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
          {colorMap.map((color) => (
            <button
              key={color.name}
              onClick={() => setBackgroundColor(color.value)}
              className="color-circle"
              style={{ backgroundImage: color.value }}
            />
          ))}
        </div>
      )}
      <label htmlFor="image-input" className="add-media-button">
        <ImageIcon className="mr-2 h-4 w-4" />
        Thêm Ảnh/Video
      </label>
      <input
        id="image-input"
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      {selectedImages.length > 0 && (
        <div className="selected-images-container">
          {selectedImages.map((image, index) => (
            <div key={index} className="image-wrapper">
              <img
                src={image}
                alt={`Selected ${index}`}
                className="selected-image"
              />
              <Button
                variant="ghost"
                onClick={() => handleRemoveImage(index)}
                className="remove-image-button"
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddPostPage;

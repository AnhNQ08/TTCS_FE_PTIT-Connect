import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Image as ImageIcon, XCircle, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import "../styles/AddPost.css";

// Không cần interface, sử dụng JSDoc để mô tả cấu trúc User nếu muốn
/** @typedef {{ id: number; username: string; avatar: string }} User */

const AddPostPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const colorMap = [
    { name: "color1", value: "linear-gradient(to bottom, #686de0, #485470)" },
    { name: "color2", value: "linear-gradient(to bottom, #ff6b6b, #556b2f)" },
    { name: "color3", value: "linear-gradient(to bottom, #48dbfb, #2c3e50)" },
    { name: "color4", value: "linear-gradient(to bottom, #a78bfa, #614ad6)" },
    { name: "color5", value: "linear-gradient(to bottom, #f9a8d4, #b042b4)" },
    { name: "color6", value: "linear-gradient(to bottom, #81c784, #388e3c)" },
  ];

  const toggleColorPicker = () => {
    setIsColorPickerOpen((prev) => !prev);
    if (backgroundColor) {
      setBackgroundColor(null);
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handlePost = useCallback(async () => {
    if (!content && selectedImages.length === 0) {
      alert("Bạn cần thêm nội dung hoặc ảnh cho bài viết!");
      return;
    }

    setIsPosting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Posting with:", {
        content,
        selectedImages,
        backgroundColor,
      });
      alert("Bài viết đã được đăng (giả lập).");
      setContent("");
      setSelectedImages([]);
      setBackgroundColor(null);
      setIsColorPickerOpen(false);
    } catch (error) {
      console.error("Failed to post:", error);
      alert("Failed to post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }, [content, selectedImages, backgroundColor]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const simulatedUser = {
          id: 1,
          username: "testuser",
          avatar: "/avatar.jpg",
        };
        setCurrentUser(simulatedUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  if (!currentUser) {
    return (
      <div className="container">
        Failed to load user data. Please login again.
      </div>
    );
  }

  return (
    <div className="container">
      <div className="add-post-header">
        <Button variant="ghost" className="back-button">
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
        <h1 className="header-title">Tạo bài viết</h1>
        <Button
          onClick={handlePost}
          className="post-button"
          disabled={isPosting}
        >
          {isPosting ? "Đang đăng..." : "Đăng"}
        </Button>
      </div>

      <div className="user-info">
        <img src={currentUser.avatar} alt="Avatar" className="avatar" />
        <span className="username">{currentUser.username}</span>
      </div>

      <div
        className="post-content"
        style={{ background: backgroundColor || "transparent" }}
      >
        <Textarea
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={cn("text-area", backgroundColor && "text-white")}
        />
      </div>

      {!isColorPickerOpen && selectedImages.length === 0 && (
        <Button
          variant="ghost"
          onClick={toggleColorPicker}
          className="color-button"
        >
          <Palette className="mr-2 h-4 w-4" />
          Màu nền
        </Button>
      )}

      {isColorPickerOpen && (
        <div className="background-color-container">
          <Button
            variant="ghost"
            onClick={toggleColorPicker}
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

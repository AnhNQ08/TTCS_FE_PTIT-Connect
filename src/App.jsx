import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import FriendPage from "./pages/Friend";
import MessengerPage from "./pages/Messenger";
import NotificationPage from "./pages/Notification";
import SignUpPage from "./pages/SignUp";
import MyProfilePage from "./pages/MyProfile";
import AddPostPage from "./pages/AddPostPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/friends" element={<FriendPage />} />
        <Route path="/messenger" element={<MessengerPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<MyProfilePage />} />
        <Route path="/add-post" element={<AddPostPage />} />
      </Routes>
    </Router>
  );
}

export default App;

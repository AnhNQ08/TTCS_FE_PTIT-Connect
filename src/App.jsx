import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import FriendPage from "./pages/Friend";
import MessengerPage from "./pages/Messenger";
import NotificationPage from "./pages/Notification";
import MyProfilePage from "./pages/MyProfile";
import AddPostPage from "./pages/AddPostPage";
import OtherUserProfile from "./pages/OtherUserProfile";
import Chat from "@/pages/Chat.jsx";
import {SockJSProvider} from "@/context/SockJSContext.jsx";

function App() {
  return (
      <SockJSProvider>
        <Router>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/friends" element={<FriendPage />} />
            <Route path="/messenger" element={<MessengerPage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
            <Route path="/add-post" element={<AddPostPage />} />
            <Route path="/other-user-profile" element={<OtherUserProfile />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Router>
      </SockJSProvider>
  );
}

export default App;

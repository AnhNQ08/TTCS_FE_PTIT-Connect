import { Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Register,
  MyProfile,
  Friend,
  AddPost,
  Messenger,
  Notification,
  UserPersonalInformation,
} from "../pages";
import Chat from "@/pages/Chat.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/friend" element={<Friend />} />
      <Route path="/add-post" element={<AddPost />} />
      <Route path="/messenger" element={<Messenger />} />
      <Route path="/other-user" element={<UserPersonalInformation />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default AppRoutes;

import { Routes, Route } from "react-router-dom";
import {
    Login,
    Chat
} from "../pages";
import HomePage from "@/pages/HomePage.jsx";
import ProfileRouter from "@/routes/ProfileRouter.jsx";


const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/chat/:chatId?" element={<Chat />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/:userId" element={<ProfileRouter />} />
        <Route path="/chat/create_group" element={<Chat />} />
    </Routes>
  );
};

export default AppRoutes;

import React from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="feed">
        <Post />
        <Post />
        <Post />
      </div>
    </div>
  );
};

export default Home;

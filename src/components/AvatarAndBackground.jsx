import React from "react";
import getImageMime from "../services/getImageFromUnit8";
import "../styles/AvatarAndBackground.css";

const AvatarAndBackground = ({
  userAvatar,
  userBackground,
  onAvatarPress,
  onBackgroundPress,
}) => {
  const backgroundSrc = `data:${getImageMime(
    userBackground
  )};base64,${userBackground}`;
  const avatarSrc = `data:${getImageMime(userAvatar)};base64,${userAvatar}`;

  return (
    <div className="avatar-background-container">
      <button className="background-btn" onClick={onBackgroundPress}>
        <img src={backgroundSrc} alt="Background" className="background-img" />
      </button>
      <button className="avatar-btn" onClick={onAvatarPress}>
        <img src={avatarSrc} alt="Avatar" className="avatar-img" />
      </button>
    </div>
  );
};

export default AvatarAndBackground;

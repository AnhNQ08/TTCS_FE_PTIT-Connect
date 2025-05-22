import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  acceptRequestMakeFriend,
  checkFriendRequest,
  checkFriendShip,
  deleteFriend,
  deleteFriendRequest,
  sendRequestMakeFriend,
<<<<<<< HEAD
} from "@/services/friendAPI";
import { getUserProfile } from "@/services/userAPI";
=======
} from "../services/user.js";

>>>>>>> 8c14b1e58cd611985bd0941b79a6019690763bb5
import AvatarAndBackground from "../components/AvatarAndBackground";

import "../styles/OtherUserProfile.css";

export default function OtherUserProfile() {
  const [dataUser, setDataUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [background, setBackground] = useState(null);
  const [bio, setBio] = useState("");
  const [isFriendShip, setFriendShip] = useState(null);
  const [isFriendRequest, setFriendRequest] = useState(null);
  const [isPersonMakeFriendRequest, setPersonMakeFrindRequsest] =
    useState(null);
  const [isShowAcceptOrDenyBox, setShowAcceptOrDenyBox] = useState(false);
  const [isShowUnFriendBox, setShowUnFriendBox] = useState(false);

  const { userID } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const dataUserTmp = await getUserProfile(userID);
        setDataUser(dataUserTmp);
        if (dataUserTmp) {
          setUserName(dataUserTmp.username);
          const avatarBase64 = btoa(
            String.fromCharCode(...new Uint8Array(dataUserTmp.avatar))
          );
          const backgroundBase64 = btoa(
            String.fromCharCode(...new Uint8Array(dataUserTmp.backgroundImage))
          );
          setAvatar(`data:image/jpeg;base64,${avatarBase64}`);
          setBackground(`data:image/jpeg;base64,${backgroundBase64}`);
          setBio(dataUserTmp.bio);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API getUser:", error);
      }
    };

    const fetchCheckFriend = async () => {
      try {
        const isFriendShipTmp = await checkFriendShip(userID);
        setFriendShip(isFriendShipTmp);
      } catch (e) {
        console.log("Sai fetchCheckFriend: ", e);
      }
    };

    const fetchCheckFriendRequest = async () => {
      try {
        const response = await checkFriendRequest(userID);
        if (response.length !== 0) {
          setFriendRequest(true);
          if (response.recipientId === userID) {
            setPersonMakeFrindRequsest(true);
          } else {
            setPersonMakeFrindRequsest(false);
          }
        } else {
          setFriendRequest(false);
        }
      } catch (e) {
        console.log("Loi fetchFriendRequest: ", e);
      }
    };

    fetchUser();
    fetchCheckFriend();
    fetchCheckFriendRequest();
  }, [userID]);
  const fetchDeleteRequestFriend1 = async () => {
    try {
      let currentUserId = null;
      const userJSON = localStorage.getItem("dataCurrentUser");
      if (userJSON !== null) {
        const currentUser = JSON.parse(userJSON);
        currentUserId = currentUser.id;
      }
      const response = await deleteFriendRequest(currentUserId, userID);
      if (response === "Friend request deleted") {
        setFriendShip(false);
        setFriendRequest(false);
      }
    } catch (e) {
      console.log("Loi fetchDeleteRequestFriend: ", e);
    }
  };

  const fetchDeleteRequestFriend2 = async () => {
    try {
      let currentUserId = null;
      const userJSON = localStorage.getItem("dataCurrentUser");
      if (userJSON !== null) {
        const currentUser = JSON.parse(userJSON);
        currentUserId = currentUser.id;
      }
      const response = await deleteFriendRequest(userID, currentUserId);
      if (response === "Friend request deleted") {
        setFriendShip(false);
        setFriendRequest(false);
      }
    } catch (e) {
      console.log("Loi fetchDeleteRequestFriend: ", e);
    }
  };

  return (
    <>
      {dataUser && (
        <div className="container">
          {avatar && background && (
            <AvatarAndBackground
              userAvatar={avatar}
              userBackground={background}
              onAvatarClick={() => {}}
              onBackgroundClick={() => {}}
            />
          )}
          <div className="content">
            <h2 className="userName">{userName}</h2>
            <div className="action">
              {isFriendRequest === true &&
                isPersonMakeFriendRequest === true &&
                isFriendShip === false && (
                  <button
                    className="friendBtn"
                    onClick={fetchDeleteRequestFriend1}
                  >
                    <SimpleLineIcons size={20} />
                    Hủy lời mời
                  </button>
                )}
              {isFriendRequest === true &&
                isPersonMakeFriendRequest === false &&
                isFriendShip === false && (
                  <button
                    className="friendBtn"
                    onClick={() => setShowAcceptOrDenyBox(true)}
                  >
                    <AntDesign size={20} />
                    Phản hồi
                  </button>
                )}
              {isFriendShip === false && isFriendRequest === false && (
                <button
                  className="friendBtn"
                  onClick={async () => {
                    const res = await sendRequestMakeFriend(userID);
                    if (res === "Request sent") {
                      setFriendRequest(true);
                      setPersonMakeFrindRequsest(true);
                    }
                  }}
                >
                  <Entypo size={20} />
                  Thêm bạn bè
                </button>
              )}
              {isFriendShip === true && (
                <button
                  className="friendBtn"
                  onClick={() => setShowUnFriendBox(true)}
                >
                  <FontAwesome5 size={20} />
                  Bạn bè
                </button>
              )}
              <button className="messengerBtn">
                <FontAwesome5 size={20} />
                Nhắn tin
              </button>
            </div>
          </div>

          {isShowAcceptOrDenyBox && (
            <div
              className="overlay"
              onClick={() => setShowAcceptOrDenyBox(false)}
            >
              <div
                className="acceptOrDenyBoxContainer"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="acceptOrDenyBox"
                  onClick={async () => {
                    await acceptRequestMakeFriend(userID);
                    setFriendShip(true);
                    setFriendRequest(false);
                    setShowAcceptOrDenyBox(false);
                  }}
                >
                  <AntDesign size={24} />
                  Chấp nhận
                </button>
                <button
                  className="acceptOrDenyBox"
                  onClick={async () => {
                    await fetchDeleteRequestFriend2();
                    setShowAcceptOrDenyBox(false);
                  }}
                >
                  <Feather size={24} />
                  Từ chối
                </button>
              </div>
            </div>
          )}

          {isShowUnFriendBox && (
            <div className="overlay" onClick={() => setShowUnFriendBox(false)}>
              <div
                className="acceptOrDenyBoxContainer"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="acceptOrDenyBox"
                  onClick={async () => {
                    await deleteFriend(userID);
                    setFriendShip(false);
                    setFriendRequest(false);
                    setShowUnFriendBox(false);
                  }}
                >
                  <Feather size={24} />
                  Hủy kết bạn
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

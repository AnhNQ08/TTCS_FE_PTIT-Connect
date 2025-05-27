import OthersProfilePage from "@/pages/OthersProfilePage.jsx";
import OwnProfilePage from "@/pages/OwnProfilePage.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getProfile} from "@/APIs/user.js";

const ProfileRouter = () => {
    const isMine = location.state?.check;
    const {userId} = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [userFriends, setUserFriends] = useState(null);
    const [userImages, setUserImages] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const response = await getProfile(userId);
            const userInfo = {
                id: response.id,
                username: response.username,
                bio: response.bio,
                avatar: response.avatar,
                backgroundImage: response.backgroundImage
            }
            setUserInfo(userInfo);
            setUserImages(response.images);
            setUserFriends(userFriends);
        }
    }, [])



    if (isMine) {
        return <OwnProfilePage userInfo={userInfo} userFriends={userFriends} userImages={userImages}/>;
    } else {
        return <OthersProfilePage userInfo={userInfo} userFriends={userFriends} userImages={userImages}/>;
    }
};

export default ProfileRouter;

import React from 'react';
import {Header} from "@/components/index.js";
import ProfileHeader from "@/components/ProfileHeader.jsx";

const OwnProfilePage = ({userInfo, userImages, userFriends}) => {
    return (
        <div>
            <Header/>
            <div className="center-body">
                <ProfileHeader isMine={true} user={userInfo}/>
            </div>
        </div>
    );
};

export default OwnProfilePage;
import React, {useState} from 'react';
import {getImageMime} from "@/utils/format.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCamera} from "@fortawesome/free-solid-svg-icons";

const ProfileHeader = ({isMine, user}) => {
    const [showEditBackground, setShowEditBackground] = useState(false);

    return (
        <div>
            <div style={{
                position: 'relative'
            }}>
                <img className="background-image" src={`data:${getImageMime(user.backgroundImage)};base64,${user.backgroundImage}`} alt=""/>
                {isMine &&
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        padding: '10px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        cursor: 'pointer'
                    }} onClick={() => setShowEditBackground(prev => !prev)}>
                        <FontAwesomeIcon icon={faCamera} fontSize="20p"/>
                        <p style={{
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}>Chỉnh sửa ảnh bìa</p>
                    </div>
                }
            </div>
        </div>
    );
};

export default ProfileHeader;
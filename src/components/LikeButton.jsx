import {useState, useRef, useEffect} from 'react';

import React from 'react';

const LikeButton = ({reactions}, currentReaction, setPosts) => {
    const [hovered, setHovered] = useState(false);
    const timerRef = useRef(null);
    const [postReaction, setPostReaction] = useState(currentReaction);

    useEffect(() => {
        if(currentReaction){
            setPostReaction(reactions.find(reaction => reaction.name === currentReaction.emotion));
        }
    }, [])

    const handleClick = () => {}

    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setHovered(true);
            // Xử lý thêm ở đây khi hover đủ thời gian
        }, 1000); // hover 1000ms (1s) mới kích hoạt
    };

    const handleMouseLeave = () => {
        clearTimeout(timerRef.current);
        setHovered(false);
    };

    return (
        <div
            className="function-item"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {hovered &&
                <div className="emoji-container">
                    {reactions.map((reaction, index) => (
                        <img src={reaction.value} alt="" key={index} className="emoji" style={{
                            width: '40px',
                            height: '40px'
                        }}/>
                    ))}
                </div>
            }
            {postReaction ? <img src={postReaction.value} alt="" className="emoji"/> : <img src="/public/reactions/border-like.png" alt="" className="emoji" style={{}}/>}
            <p>Thích</p>
        </div>
    );
};

export default LikeButton;

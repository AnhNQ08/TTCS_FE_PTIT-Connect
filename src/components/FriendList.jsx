import React, {useEffect, useState} from 'react';
import getImageMime from "@/services/getImageFromUnit8.js";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const FriendList = ({setChosenParticipant, opponent, index, chosenParticipant}) => {
    const [chosen, setChosen] = useState(false);

    useEffect(() => {
        if(chosen) setChosenParticipant(prev => prev.concat(opponent));
        else if(chosen === false) setChosenParticipant(prev => prev.filter(participant => participant.id !== opponent.id));
    }, [chosen]);

    useEffect(() => {
        if(!chosenParticipant.find(participant => participant.id === opponent.id)) setChosen(false);
    }, [chosenParticipant]);

    return (
        <div key={index} className="friend-div" onClick={() => {
            setChosen(prev => !prev);
        }}>
            <img src={`data:${getImageMime(opponent.avatar)};base64,${opponent.avatar}`} alt="" className="participant-avatar"/>
            <p className="participant-name">{opponent.username}</p>
            <FontAwesomeIcon icon={faCheck} className={`check-icon ${chosen ? 'checked' : ''}`}/>
        </div>
    );
};

export default FriendList;
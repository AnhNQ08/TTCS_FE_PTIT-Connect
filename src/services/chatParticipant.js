import * as request from '../utils/request';

export const changeRole = (conversationId, participantId, role) => {
    return request.put(`/participant/changeRole/${conversationId}/${participantId}`, {role}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}

export const changeNickname = (conversationId, participantId, nickname) => {
    return request.put(`/participant/changeNickname/${conversationId}/${participantId}`, {nickname}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}

export const addParticipant = (conversationId, participantIds) => {
    return request.put(`/participant/addParticipant/${conversationId}`, {participantIds}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}

export const kickParticipant = (conversationId, participantId) => {
    return request.remove(`/participant/kickParticipant/${conversationId}/${participantId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}
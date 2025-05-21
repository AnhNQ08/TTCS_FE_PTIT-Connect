import * as request from '../utils/request.js';

export const getMessages = async (conversationId) => {
    return request.get(`/chat/conversation/${conversationId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}


export const uploadMessageFile = (files) => {
    return request.post('/chat/upload/file', files, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}
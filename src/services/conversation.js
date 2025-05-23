import * as request from '../utils/request.js'

export const getChatRoom = async () => {
    return request.get('/conversation', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}

export const getConversationFiles = async (conversationId, types, pageNumber) => {
    return request.get(`/conversation/getFiles/${conversationId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: {
            types: types.join(','),
            pageNumber
        }
    })
}

export const updateLastMessageStatus = async (conversationId, userId) => {
    return request.put(`/conversation/lastMessage/updateStatus/${conversationId}/${userId}`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}

export const updateName = async (conversationId, name) => {
    return request.put(`/conversation/updateName/${conversationId}`, {name}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}

export const changeAvatar = async (conversationId, avatar) => {
    return request.put(`/conversation/changeAvatar/${conversationId}`, avatar, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}
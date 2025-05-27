import * as request from '../utils/request.js';

export const findFriends = async (userId, keyword, pageNumber) => {
    return request.get('/friend/getList/' + userId, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: {
            keyword, pageNumber
        }}
    )
}

export const findAllFriends = async (keyword) => {
    return request.get('/friend/getByCurrentUser', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: {
            keyword
        }
    })
}

export const getFriendRequests = async (pageNumber, pageSize) => {
    return request.get('/friendRequest/getList', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: {
            pageNumber, pageSize
        }
    })
}

export const acceptFriendRequest = async (senderId) => {
    return request.post('/friend/acceptRequest/' + senderId, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}

export const declineFriendRequest = async (senderId, recipientId) => {
    return request.remove('/friendRequest/delete/' + senderId + '/' + recipientId, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
    )
}

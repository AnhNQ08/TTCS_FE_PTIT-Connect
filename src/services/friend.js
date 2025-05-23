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
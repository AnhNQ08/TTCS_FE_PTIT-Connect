import * as request from '../utils/request.js'

export const getChatRoom = async () => {
    return request.get('/conversation', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}
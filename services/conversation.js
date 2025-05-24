import * as request from './request';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllConversation = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        '/conversation/getAll',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
}


// export const updateLastMessageStatus = async (conversationId, userId) => {
//     return request.put(`/conversation/lastMessage/updateStatus/${conversationId}/${userId}`, {}, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//         }
//     })
// }

// export const updateName = async (conversationId, name) => {
//     return request.put(`/conversation/updateName/${conversationId}`, { name }, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//         }
//     })
// }

// export const changeAvatar = async (conversationId, avatar) => {
//     return request.put(`/conversation/changeAvatar/${conversationId}`, avatar, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//         }
//     })
// }
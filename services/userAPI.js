import AsyncStorage from '@react-native-async-storage/async-storage';
import * as request from './request';
import { refreshToken } from './authentication';

export const getCurrentUser = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get('/user/currentUser', {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    });
}

export const getUserProfile = async (userId) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get('/user/profile/' + userId, {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    })
}

export const updateUserAvatar = async (formData) => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    return await request.put(
        '/user/profile/update/avatar',
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};


export const updateUserBackground = async (formData) => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    return await request.put(
        '/user/profile/update/backgroundImage',
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};

export const createNewPost = async (formData) => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    return await request.post(
        'post/createPersonal',
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    )
}

export const getNewestPost = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        'post/newestPost',
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const searchUser = async (nameUser) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        `user/search?username=${nameUser}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const checkFriendShip = async (idUser) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        `friend/checkFriendship/${idUser}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const checkFriendRequest = async (idUser) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        `friendRequest/check/${idUser}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const sendRequestMakeFriend = async (idUser) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.post(
        `friendRequest/send/${idUser}`,
        {}
        ,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const acceptRequestMakeFriend = async (idUser) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.post(
        `friend/acceptRequest/${idUser}`,
        {}
        ,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const deleteFriend = async (idUser) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.erase(
        `friend/delete/${idUser}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const deleteFriendRequest = async (sengerId, reciverId) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.post(
        `friendRequest/delete?senderId=${sengerId}&receiverId=${reciverId}`,
        {}
        ,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}
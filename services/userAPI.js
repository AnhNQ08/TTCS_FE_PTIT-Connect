import AsyncStorage from '@react-native-async-storage/async-storage';
import * as request from './request';

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
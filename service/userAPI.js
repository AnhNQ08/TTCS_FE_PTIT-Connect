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
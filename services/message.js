import * as request from './request';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllMessenger = async (conversationId) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        `message/getMessages/${conversationId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
}
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
    console.log("url getUserProfile: /user/profile/", userId)
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
        'post/create',
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    )
}

export const syncPublicPost = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.post(
        'post/syncPublicPost',
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

export const searchUser = async (userName) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        `user/search?username=${userName}`,
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
        `friendRequest/delete/${sengerId}/${reciverId}`,
        {}
        ,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const sendReaction = async (type, emotion, id) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.post(
        `reaction/send`,
        {
            "type": type,
            "emotion": emotion,
            "id": id
        },
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const changeReaction = async (id, type) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.put(
        `reaction/change/${id}`,
        JSON.stringify(type)
        ,
        {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        }
    )
}

export const deleteReaction = async (reactionId) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.erase(
        `reaction/delete/${reactionId}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const getPostComment = async (postID) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        `postComment/post/${postID}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const createCommentPost = async (formData, postID) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.post(
        `postComment/create/post/${postID}`,
        formData,
        {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'multipart/form-data',
            }
        }
    )
}

export const createResponseComment = async (commentId, formData) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.post(
        `postComment/createResponse/${commentId}`,
        formData,
        {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'multipart/form-data',
            }
        }
    )
}

export const getResponsesComment = async (commentId) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        `postComment/getResponse/${commentId}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const getPostUserId = async (userId) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        `post/user/${userId}`,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}

export const getAllNotification = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return await request.get(
        `notification/get`,
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        }
    )
}
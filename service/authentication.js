import * as request from './request.js'

export const login = async (email, password) => {
    return await request.post('authenticate/login', { email, password });
}

export const singUp = async (email, password, userName) => {
    return await request.post('authenticate/register', { email, password, userName });
}

export const refreshToken = async () => {
    return await request.post('authenticate/refresh-token', {}, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("refreshToken"),
        }
    });
}

export const logout = async () => {
    const response = await request.post('logout', {}, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem('accessToken'),
        }
    })
    return response;
}
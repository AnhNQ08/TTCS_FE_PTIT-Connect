import * as request from '../utils/request.js';

export const sendReaction = async (reaction) => {
    return await request.post('/reaction/send', reaction, {
        headers: {
            Authorization: `Bearer ` + localStorage.getItem("accessToken")
        }
    })
}

export const changeReaction = async (emotion) => {
  return await request.put('/reaction/send', emotion, {
    headers: {
      Authorization: `Bearer ` + localStorage.getItem("accessToken")
    }
  })
}
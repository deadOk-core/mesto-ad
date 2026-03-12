import axios from "axios";

/*файл содержит код запросов*/

/*API-сервера и повторяющиеся заголовки запроса*/
const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "9a93c610-4c06-4e72-81fb-e79d7b8ec97d", //Мой личный токен
    "Content-Type": "application/json",
  },
};

/*Cоздание нового экземпляра Axios*/
const sample = axios.create({
  baseURL: config.baseUrl,
  headers: config.headers,
});

const handleResponse = (response) => response.data;

/*Получение данных пользователя с сервера*/
export const getUserInfo = () => {
  return sample(`/users/me`).then(handleResponse);
};

export const getCardList = () => {
  return sample(`/cards`).then(handleResponse);
};

export const setUserInfo = ({ name, about }) => {
  return sample
    .patch(`/users/me`, {
      name,
      about,
    })
    .then(handleResponse);
};

export const setUserAvatar = (avatar) => {
  return sample.patch(`/users/me/avatar`, { avatar }).then(handleResponse);
};

export const setCard = ({ name, link }) => {
  return sample
    .post(`/cards`, {
      name,
      link,
    })
    .then(handleResponse);
};

export const deleteUserCard = (userCard) => {
  return sample.delete(`/cards/${userCard._id}`).then(handleResponse);
};

export const changeLikeCardStatus = (cardID, isLiked) => {
  return sample(`/cards/likes/${cardID}`, {
    method: isLiked ? "DELETE" : "PUT"
  }).then(handleResponse);
};
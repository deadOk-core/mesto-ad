/*файл содержит код запросов*/

/*API-сервера и повторяющиеся заголовки запроса*/
const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "9a93c610-4c06-4e72-81fb-e79d7b8ec97d", //Мой личный токен
    "Content-Type": "application/json",
  },
};

/* Проверяем, успешно ли выполнен запрос, и отклоняем промис в случае ошибки. */
const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

/*Получение данных пользователя с сервера*/
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, { // Запрос к API-серверу
    headers: config.headers, // Подставляем заголовки
  }).then(getResponseData);  // Проверяем успешность выполнения запроса
};

export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
    }).then(getResponseData);
};
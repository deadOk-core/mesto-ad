/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { getCardList, getUserInfo, setUserInfo, setUserAvatar, setCard, deleteUserCard, changeLikeCardStatus } from "./components/api.js";
import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

//модальное окно с инфой о карточке
const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const popupList = cardInfoModalWindow.querySelector(".popup__list");

//шаблон списка с dt dd
const popupInfoDefinitionTemplate = document.getElementById("popup-info-definition-template");

const popupInfoUserPreviewTemplate = document.getElementById("popup-info-user-preview-template");

// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const profileFormButton = profileForm.querySelector(".popup__button");
const cardFormButton = cardForm.querySelector(".popup__button");
const avatarFormButton = avatarForm.querySelector(".popup__button");

const showLoading = (button, buttonText) => {
  button.dataset.originalText = button.textContent;
  button.textContent = `${buttonText}...`;
};

const hideLoading = (button) => {
  button.textContent = button.dataset.originalText;
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  showLoading(profileFormButton, "Сохранение");
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      hideLoading(profileFormButton);
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  showLoading(avatarFormButton, "Сохранение");
  setUserAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      hideLoading(avatarFormButton);
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  showLoading(cardFormButton, "Создание");
  setCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((userData) => {
      placesWrap.prepend(
        createCardElement(
          {
            name: userData.name,
            link: userData.link,
          },
          {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: likeCard,
            onDeleteCard: deleteCard,
            onInfoCard: handleInfoClick,
          }
        )
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      hideLoading(cardFormButton);
    });

  clearValidation(cardForm, validationSettings);
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
  clearValidation(profileForm, validationSettings);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
  clearValidation(avatarForm, validationSettings);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
  clearValidation(cardForm, validationSettings);
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

// включение валидации вызовом enableValidation
// все настройки передаются при вызове

enableValidation(validationSettings);

const hideOtherDeleteButtons = (card, userData, deleteButton) => {
  if (card.owner._id !== userData._id) {
    deleteButton.style.display = "none";
  }
};

const isCardLikedStart = (card, userData, likeButton) => {
  card.likes.forEach((likeUserData) => {
    if (likeUserData._id === userData._id) {
      likeButton.classList.add("card__like-button_is-active");
  }
  })
}

const isCardLiked = (cardElement) => {
  return cardElement.classList.contains("card__like-button_is-active");
};

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    cards.forEach((card) => {
      const cardElement = createCardElement(card, {
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: () => {
          const likeButton = cardElement.querySelector(".card__like-button");
          const cardLikeCount = cardElement.querySelector(".card__like-count");
          //Запрос на лайк
          changeLikeCardStatus(card._id, isCardLiked(likeButton))
            .then((updateCard) => {
              likeCard(likeButton);
              cardLikeCount.textContent = updateCard.likes.length;
            })
            .catch((err) => {
              console.log("ошибка при лайке:", err);
            })
        },
        onDeleteCard: () => {
          //Запрос на удаление
          deleteUserCard({ userCard: card })
            .then(() => {
              cardElement.remove();
            })
            .catch((err) => {
              console.log("ошибка при удалении:", err);
            });
        },
        onInfoCard: () => {
          handleInfoClick(card._id);
        }
      });
      const likeButton = cardElement.querySelector(".card__like-button");
      isCardLikedStart(card, userData, likeButton);

      placesWrap.append(cardElement);
      const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
      hideOtherDeleteButtons(card, userData, deleteButton);

      const cardLikeCount = cardElement.querySelector(".card__like-count");
      cardLikeCount.textContent = card.likes.length;
    });
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
  })
  .catch((err) => {
    console.log(err);
  });

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (infoTerm, infoDescription) => {
  const popupInfoItemClone = popupInfoDefinitionTemplate.content.querySelector(".popup__info-item").cloneNode(true);
  const popupInfoTerm = popupInfoItemClone.querySelector(".popup__info-term");
  const popupInfoDescription = popupInfoItemClone.querySelector(".popup__info-description");

  popupInfoTerm.textContent = infoTerm;
  popupInfoDescription.textContent = infoDescription;

  return popupInfoItemClone;
};

const createUserListItem = (userName) => {
  const popupListItem = popupInfoUserPreviewTemplate.content.querySelector(".popup__list-item").cloneNode(true);
  popupListItem.textContent = userName;
  return popupListItem;
};

const handleInfoClick = (cardId) => {
  cardInfoModalInfoList.innerHTML = '';
  popupList.innerHTML = '';

  /* Для вывода корректной информации необходимо получить актуальные данные с сервера. */
  getCardList()
    .then((cards) => {
      let cardData = cards.find((card) => card._id === cardId);

      cardInfoModalInfoList.append(
        createInfoString("Описание:", cardData.name)
      );
      cardInfoModalInfoList.append(
        createInfoString("Дата создания:", formatDate(new Date(cardData.createdAt))
        )
      );
      cardInfoModalInfoList.append(
        createInfoString("Владелец:", cardData.owner.name)
      );
      cardInfoModalInfoList.append(
        createInfoString("Количество лайков:", cardData.likes.length)
      );

      cardData.likes.forEach((user) => {
        popupList.append(createUserListItem(user.name));
      });

      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

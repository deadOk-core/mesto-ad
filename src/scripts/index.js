/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import {
  getCardList,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  setCard,
  deleteUserCard,
  changeLikeCardStatus
} from "./components/api.js";
import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description"
);

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

//переименовать переменные, выбрать попап с модальным окном для подтверждения удаления:
// const agreementModalWindow = document.querySelector(".popup_type_remove-card");
// const agreementForm = agreementModalWindow.querySelector(".popup__form");
// const agreeFormButton = agreementForm.querySelector(".popup__button");
// const closeAgreementButton = agreementModalWindow.querySelector(".popup__close");

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

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
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
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  setUserAvatar({
    avatar: avatarInput.value,
  })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
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
          }
        )
      );
    })

    .catch((err) => {
      console.log(err);
    });

  closeModalWindow(cardFormModalWindow);
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

const hideOtherDeleteButtons = (card, userData, buttonElement) => {
  if (card.owner._id !== userData._id) {
    buttonElement.style.display = "none";
  }
};

// function showAgreementModalWindow(cardElement, card) {
//   return function() {
//     agreeFormButton.classList.remove("popup__button_disabled");
//     openModalWindow(agreementModalWindow);
//     //надо это разъединить
//     agreementForm.addEventListener("submit", function submitHandler(evt) {
//       evt.preventDefault();
//       agreeFormButton.classList.add("popup__button_disabled");
//       deleteUserCard({ userCard: card })
//         .then(() => {
//           cardElement.remove();
//           closeModalWindow(agreementModalWindow);
//           agreementForm.removeEventListener("submit", submitHandler);
//         })
//         .catch((err) => {
//           console.log("Ошибка при удалении карточки:", err);
//           closeModalWindow(agreementModalWindow);
//           agreementForm.removeEventListener("submit", submitHandler);
//         });
//     });

//     closeAgreementButton.addEventListener("click", function closeHandler() {
//       closeModalWindow(agreementModalWindow);
//       agreeFormButton.classList.add("popup__button_disabled");
//       agreementForm.removeEventListener("submit", submitHandler);
//       closeAgreementButton.removeEventListener("click", closeHandler);
//     });
//   };
// }

const isCardLiked = (cardElement) => {
  return (cardElement.classList.contains("card__like-button_is-active"));
}

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    cards.forEach((card) => {
      const cardElement = createCardElement(card, {
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: () => {
          const likeButton = cardElement.querySelector('.card__like-button');
          changeLikeCardStatus(card._id, isCardLiked(cardElement))
          .then(() => likeCard(likeButton))
          .catch((err) => {
            console.log("ошибка при лайке:", err);
          })
        },
        onDeleteCard: () => {
          //Делаем запрос на удаление
          deleteUserCard({ userCard: card })
            .then(() => {
              cardElement.remove();
            })
            .catch((err) => {
              console.log("ошибка при удалении:", err);
            });
        },
      });

      placesWrap.append(cardElement);
      const deleteButton = cardElement.querySelector(
        ".card__control-button_type_delete"
      );
      hideOtherDeleteButtons(card, userData, deleteButton);
    });

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
  })
  .catch((err) => {
    console.log(err); // В случае возникновения ошибки выводим её в консоль
  });
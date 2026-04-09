export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const isCardLikedStart = (card, userId, likeButton) => {
  card.likes.forEach((likeuserId) => {
    if (likeuserId._id === userId) {
      likeButton.classList.add("card__like-button_is-active");
  }
  })
};

const hideOtherDeleteButtons = (card, userId, deleteButton) => {
  if (card.owner._id !== userId) {
    deleteButton.style.display = "none";
  }
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoCard }, userId
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardLikeCount = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const iButton = cardElement.querySelector(".card__control-button_type_info");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  cardLikeCount.textContent = data.likes.length;

  isCardLikedStart(data, userId, likeButton);
  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(likeButton));
  }

  hideOtherDeleteButtons(data, userId, deleteButton);
  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  if (onInfoCard) {
    iButton.addEventListener("click", () => onInfoCard(data._id));
  }

  return cardElement;
};

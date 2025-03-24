import "./index.css";
import avatar from "../images/avatar.jpg";
import plusIcon from "../images/plus.svg";
import logoSrc from "../images/logo.svg";
import cross from "../images/white-cross.svg";
import closeCross from "../images/cross.svg";
import pencilIcon from "../images/pencil.svg";
import whitePencilIcon from "../images/white-pencil.svg";
import heartLikeIcon from "../images/heart-like.svg";
import heartLikeIconHover from "../images/heart-like-hover.svg";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

const avatarImage = document.getElementById("avatarIcon");
if (avatarImage) {
  avatarImage.src = avatar;
}

const pencilImage = document.getElementById("pencil");
if (pencilImage) {
  pencilImage.src = pencilIcon;
}

const logoImage = document.getElementById("logo");
if (logoImage) {
  logoImage.src = logoSrc;
}

const plusImage = document.getElementById("plus-icon");
if (plusImage) {
  plusImage.src = plusIcon;
}

const crossOne = document.getElementById("cross");
if (crossOne) {
  crossOne.src = cross;
}

const crossTwo = document.getElementById("closeCross");
if (crossTwo) {
  crossTwo.src = closeCross;
}

const avatarEditIcon = document.querySelector(".profile__avatar-edit-icon");
if (avatarEditIcon) {
  avatarEditIcon.src = whitePencilIcon;
}

// DOM elements for profile
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const avatarEditButton = document.querySelector(".profile__avatar-edit");
const avatarEditModal = document.querySelector("#avatar-edit-modal");
const avatarForm = document.querySelector("#avatar-form");
const avatarInput = document.querySelector("#avatar-input");
const avatarModalCloseBtn = avatarEditModal.querySelector(
  ".modal__close-button"
);

// API initialization
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "528aeb29-13e8-4b53-8154-7e2f9458e435",
    "Content-Type": "application/json",
  },
});

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const avatarUrl = avatarInput.value;

  const submitButton = avatarForm.querySelector(".modal__submit-button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .editUserAvatar(avatarUrl)
    .then((userData) => {
      avatarImage.src = userData.avatar;
      closeModal(avatarEditModal);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

avatarEditButton.addEventListener("click", () => {
  openModal(avatarEditModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarEditModal);
});

// DOM elements for modal and form
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector("#modal-form");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescription = editModal.querySelector("#profile-description");
const editSubmitButton = editModal.querySelector(".modal__submit-button");
const profileEditButton = document.querySelector(".profile__edit-button");
const deleteConfirmationModal = document.querySelector(
  "#delete-confirmation-modal"
);
const deleteConfirmButton = deleteConfirmationModal.querySelector(
  ".modal__confirm-button"
);
const deleteCancelButton = deleteConfirmationModal.querySelector(
  ".modal__cancel-button"
);

let selectedCard;
let selectedCardId;

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteConfirmationModal);
}

function handleConfirmDelete() {
  showLoadingModal("Deleting post...");
  const originalButtonText = deleteConfirmButton.textContent;

  deleteConfirmButton.textContent = "Deleting...";
  deleteConfirmButton.disabled = true;

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteConfirmationModal);
    })
    .catch((err) => {
      console.error("Error deleting card:", err);
      alert("Could not delete card. Please try again later.");
    })
    .finally(() => {
      hideLoadingModal();
      deleteConfirmButton.textContent = originalButtonText;
      deleteConfirmButton.disabled = false;
    });
}

const handleCancelDelete = () => {
  console.log("Cancel delete clicked"); // Debug log
  closeModal(deleteConfirmationModal);
};

deleteConfirmButton.addEventListener("click", handleConfirmDelete);
deleteCancelButton.addEventListener("click", handleCancelDelete);

// Define the cardsList variable here
const cardsList = document.querySelector(".cards__list");

// DOM elements for the New Card Modal
const cardModal = document.querySelector("#new-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-button");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-button");
const cardModalBtn = document.querySelector(".profile__post-button");
const cardNameInput = cardModal.querySelector("#card-name-input");
const cardCaptionInput = cardModal.querySelector("#card-caption-input");

function renderCard(data, method = "append") {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__del-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  // Add delete functionality with confirmation
  deleteButton.addEventListener("click", () => {
    deleteConfirmationModal.classList.add("modal_opened");
    handleDeleteCard(cardElement, data);
  });

  deleteConfirmationModal
    .querySelector(".modal__close-button")
    .addEventListener("click", () => {
      closeModal(deleteConfirmationModal);
    });

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_liked");
  });

  cardImageEl.addEventListener("click", () => {
    const previewModal = document.querySelector("#preview-modal");
    const modalImage = previewModal.querySelector(".modal__image");
    const modalCaption = previewModal.querySelector(".modal__caption");
    modalImage.src = data.link;
    modalImage.alt = data.name;
    modalCaption.textContent = data.name;
    openModal(previewModal);
  });

  cardsList[method](cardElement);
}

api
  .getAppInfo()
  .then(({ userInfo, cards }) => {
    if (avatarImage) {
      avatarImage.src = userInfo.avatar;
    }
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;

    cards.forEach((card) => renderCard(card));
  })
  .catch((err) => {
    console.error("Error fetching app info:", err);
    alert("Could not load profile or cards. Please try again later.");
  });

profileEditButton.addEventListener("click", () => {
  resetValidation(editFormElement, settings);

  editModalNameInput.value = profileName.textContent;
  editModalDescription.value = profileDescription.textContent;

  openModal(editModal);
});

const editModalCloseBtn = editModal.querySelector(".modal__close-button");
editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

const loadingModal = document.querySelector("#loading-modal");

function showLoadingModal(loadingText = "Saving...") {
  const loadingTextElement = loadingModal.querySelector(".modal__loading-text");
  loadingTextElement.textContent = loadingText;
  openModal(loadingModal);
}

function hideLoadingModal() {
  closeModal(loadingModal);
}

editFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  showLoadingModal("Saving profile..."); // Show loading modal

  const originalButtonText = editSubmitButton.textContent;
  editSubmitButton.textContent = "Saving...";
  editSubmitButton.disabled = true;

  const updatedName = editModalNameInput.value;
  const updatedAbout = editModalDescription.value;

  api
    .editUserInfo({ name: updatedName, about: updatedAbout })
    .then((updatedUserInfo) => {
      profileName.textContent = updatedUserInfo.name;
      profileDescription.textContent = updatedUserInfo.about;
      closeModal(editModal);
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
      alert("Could not update profile. Please try again later.");
    })
    .finally(() => {
      hideLoadingModal(); // Hide loading modal
      editSubmitButton.textContent = originalButtonText;
      editSubmitButton.disabled = false;
    });
});

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalOnEscape);
  modal.addEventListener("mousedown", closeModalOnOverlay);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalOnEscape);
  modal.removeEventListener("mousedown", closeModalOnOverlay);
}

function closeModalOnEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function closeModalOnOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function disableButton(buttonElement, config) {
  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.disabled = true;
}

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

const previewModal = document.querySelector("#preview-modal");
const previewCloseButton = previewModal.querySelector(
  ".modal__close-button_preview"
);
previewCloseButton.addEventListener("click", () => closeModal(previewModal));

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  showLoadingModal("Creating post...");

  const originalButtonText = cardSubmitBtn.textContent;
  cardSubmitBtn.textContent = "Saving...";
  cardSubmitBtn.disabled = true;

  const inputValues = {
    name: cardCaptionInput.value,
    link: cardNameInput.value,
  };

  api
    .createCard(inputValues)
    .then((cardData) => {
      renderCard(cardData, "prepend");
      closeModal(cardModal);
      cardForm.reset();
      disableButton(cardSubmitBtn, settings);
    })
    .catch((err) => {
      console.error("Error creating card:", err);
      alert("Could not create card. Please try again later.");
    })
    .finally(() => {
      hideLoadingModal();
      cardSubmitBtn.textContent = originalButtonText;
      cardSubmitBtn.disabled = false;
    });
});

enableValidation(settings);

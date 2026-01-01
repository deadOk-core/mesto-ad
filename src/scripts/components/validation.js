function showInputError(formElement, inputElement, settings, errorMessage) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(settings.inputErrorClass)

     if (inputElement.dataset.errorMessage){
        errorElement.textContent = inputElement.dataset.errorMessage;
    } else {
        errorElement.textContent = errorMessage;
    }

    errorElement.classList.add(settings.errorClass)
}

function hideInputError(formElement, inputElement, settings) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(settings.inputErrorClass)
    errorElement.classList.remove(settings.errorClass)
    errorElement.textContent = "";
    
}

function checkInputValidity(formElement, inputElement, settings) {
    if(!inputElement.validity.valid) {
        showInputError(formElement, inputElement, settings, inputElement.validationMessage);
        toggleButtonState(formElement, inputElement, settings);
    } else {
        hideInputError(formElement, inputElement, settings);
    }
}

function hasInvalidInput(inputList) {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    })
}

function disableSubmitButton(buttonElement, settings) {
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
}

function enableSubmitButton(buttonElement, settings) {
    buttonElement.classList.remove(settings.inactiveButtonClass);
    buttonElement.disabled = false;
}

function toggleButtonState(inputList, buttonElement, settings) {
    if(hasInvalidInput(inputList)) {
        disableSubmitButton(buttonElement, settings);
    } else {
        enableSubmitButton(buttonElement, settings);
    }
}

function setEventListeners(formElement, settings) {
    const buttonElement = formElement.querySelector(settings.submitButtonSelector)
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement, settings);
            toggleButtonState(inputList, buttonElement, settings);
    })
    });
}

export function clearValidation(formElement, settings) {
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, settings)
    })
    disableSubmitButton(buttonElement, settings);
}

export function enableValidation(settings) {
    const formList = Array.from(document.querySelectorAll(settings.formSelector))
    formList.forEach((form) => {
        setEventListeners(form, settings);
    });
}
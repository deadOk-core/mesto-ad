function showInputError(formElement, inputElement, settings, errorMessage) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(settings.errorClass)
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.inactiveButtonClass)
}

function hideInputError(formElement, inputElement, settings) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(settings.errorClass)
    errorElement.classList.remove(settings.inactiveButtonClass)
    errorElement.textContent = "";
}
function checkInputValidity(formElement, inputElement, settings) {
    if(!inputElement.validity.valid) {
        
        showInputError(formElement, inputElement, settings, inputElement.validationMessage);
        // toggleButtonState()
    } else {
        hideInputError(formElement, inputElement, settings);
    }
}

function hasInvalidInput(formElement) {
    return formElement.some((inputElement) => {
        return !inputElement.validity.valid;
    })
    
}

// function disableSubmitButton
// function enableSubmitButton
function toggleButtonState(formElement, inputElement) {

}

function setEventListeners(formElement, settings) {
    
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            
            
            checkInputValidity(formElement, inputElement, settings);
            toggleButtonState();
    })
    });
}

export function clearValidation() {

}

export function enableValidation(settings) {
    const formList = Array.from(document.querySelectorAll(settings.formSelector))
    console.log('formList:', formList); // Показывает массив объектов
    formList.forEach((form) => {
        setEventListeners(form, settings);
    });
}
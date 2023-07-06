const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('passwordVerify');
const passwordErrorMessage = document.getElementById('password-error-message');
const submitButton = document.querySelector('.send');

passwordInput.addEventListener('input', checkPasswordMatch);
confirmPasswordInput.addEventListener('input', checkPasswordMatch);
function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        passwordErrorMessage.textContent = 'Passwords dont match';
        submitButton.disabled = true;
    } else {
        passwordErrorMessage.textContent = '';
        submitButton.disabled = false;
    }
}

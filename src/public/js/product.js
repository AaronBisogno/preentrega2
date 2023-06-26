const socket = io();

const input = document.getElementById('inputnumber');
const button = document.getElementById('addToCart');

input.addEventListener('change', () => {
    if (input.value === '') {
        input.value = 1;
    }
});

button.addEventListener('click', () => {
    const cid = button.getAttribute('data-cid');
    // const newQuantity = input.value
    // input.value = 1
    const pid = button.getAttribute('data-pid');
    socket.emit('pushProduct', { cid, pid });
    alert('added (TODO: modal)');
});

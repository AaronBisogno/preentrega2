const socket = io();

let userName = '';

async function getName() {
    const { value: name } = await Swal.fire({
        title: 'Enter your name',
        input: 'text',
        inputLabel: 'Your name',
        inputValue: '',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!';
            }
        },
    });
    userName = name;
}

getName();

socket.on('msg_tofront', (msgs) => {
    let msgFormated = '';
    msgs.forEach((m) => {
        msgFormated += `<div>`;
        msgFormated += `<p> ${m.user} </p>`;
        msgFormated += `<p> ${m.msg} </p>`;
        msgFormated += `</div>`;
    });
    const msgsDiv = document.getElementById('div-chat');
    msgsDiv.innerHTML = msgFormated;
});

const chatBox = document.getElementById('chat-box');
chatBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('msg_toback', {
                user: userName,
                msg: chatBox.value + ' ' + new Date().toLocaleString(),
            });
        }
        chatBox.value = '';
    }
});

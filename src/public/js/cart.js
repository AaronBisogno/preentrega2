
const socket = io();


socket.on('cartUpdated', (result) => {
    const divElement = document.getElementById('myDiv');
    divElement.innerHTML = '';

    result.forEach((p) => {

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.style.width = '18rem';

        const image = document.createElement('img');
        image.src = '/img/default.png';
        image.className = 'card-img-top';
        image.alt = 'Product Image';
        cardDiv.appendChild(image);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        cardDiv.appendChild(cardBody);

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = p.title;
        cardBody.appendChild(title);

        const description = document.createElement('p');
        description.className = 'card-text';
        description.textContent = p.description;
        cardBody.appendChild(description);

        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group list-group-flush';
        cardDiv.appendChild(listGroup);

        const codeItem = createListGroupItem('Code:', p.code);
        const priceItem = createListGroupItem('Price:', p.price);
        const categoryItem = createListGroupItem('Category:', p.category);
        const quantityItem = createListGroupItem('Quantity:', p.quantity);

        listGroup.appendChild(codeItem);
        listGroup.appendChild(priceItem);
        listGroup.appendChild(categoryItem);
        listGroup.appendChild(quantityItem);

        const cardBodyButtons = document.createElement('div');
        cardBodyButtons.className = 'card-body';
        cardBodyButtons.style.textAlign = 'center';
        cardBodyButtons.style.display = 'flex';
        cardBodyButtons.style.flexDirection = 'column';
        cardBodyButtons.style.alignItems = 'center';
        cardBodyButtons.style.gap = '10px';
        cardDiv.appendChild(cardBodyButtons);
        
        const moreInfoLink = createCardLink('#', 'More Info');
        cardBodyButtons.appendChild(moreInfoLink);

        const addProductLink = createCardLink('#', 'Add product');
        addProductLink.style.margin = '0'
        cardBodyButtons.appendChild(addProductLink);
        divElement.appendChild(cardDiv);

        const removeButton = createRemoveButton(p._id);
        removeButton.style.margin = '0'
        cardBodyButtons.appendChild(removeButton);

        const buttonsRemove = document.querySelectorAll('.remove-button');
        buttonsRemove.forEach((button) => {
            button.addEventListener('click', () => {
                const cid = cartIdValue
                const pid = button.getAttribute('data-pid');
                socket.emit('removeFromCart', {cid, pid});
            });
        });
    });
});

function createListGroupItem(label, value) {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.innerHTML = `<strong>${label}</strong> ${value}`;
    return listItem;
}

function createCardLink(href, text) {
    const link = document.createElement('a');
    link.href = href;
    link.className = 'card-link';
    link.textContent = text;
    return link;
}

function createRemoveButton(pid) {
    const button = document.createElement('button');
    button.dataset.pid = pid;
    button.type = 'submit';
    button.className = 'card-link remove-button';
    button.innerHTML = '🗑️';
    return button;
}

const buttonRemove = document.querySelectorAll('.remove-button');
const cartId = document.querySelector('#cartId')
const cartIdValue = cartId.innerText;

buttonRemove.forEach((button) => {
    button.addEventListener('click', () => {
        const cid = cartIdValue
        const pid = button.dataset.pid;
        socket.emit('removeFromCart', {cid, pid});
    });
});
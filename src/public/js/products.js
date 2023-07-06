const socket = io();

const buttonAdd = document.querySelectorAll('.add-to-cart');
const buttoncid = document.querySelector('.add-to-cart');
const cid = buttoncid.getAttribute('data-cid');

buttonAdd.forEach((b) => {
    b.addEventListener('click', () => {
        const pid = b.getAttribute('data-pid');
        socket.emit('pushProduct', { cid, pid });
        alert('added (TODO: modal)');
    });
});

const buttonDelete = document.querySelectorAll('.remove-button');

buttonDelete.forEach((b) => {
    b.addEventListener('click', () => {
        const pid = b.getAttribute('data-pid');
        socket.emit('delete-Product', pid);
    });
});

socket.on('products', (products) => {
    const myDiv = document.getElementById('myDiv');
    myDiv.innerHTML = '';

    products.forEach((p) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.style.width = '18rem';

        const image = document.createElement('img');
        image.src = '/img/default.png';
        image.className = 'card-img-top';
        image.alt = '...';

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';

        const link = document.createElement('a');
        link.href = `http://localhost:8080/products/${p._id}`;
        link.target = '_blank';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = p.title;

        const description = document.createElement('p');
        description.className = 'card-text';
        description.textContent = p.description;

        cardBodyDiv.appendChild(link);
        link.appendChild(title);
        cardBodyDiv.appendChild(description);

        const list = document.createElement('ul');
        list.className = 'list-group list-group-flush';

        const codeLi = document.createElement('li');
        codeLi.className = 'list-group-item';
        codeLi.innerHTML = `<strong>Code:</strong> ${p.code}`;

        const priceLi = document.createElement('li');
        priceLi.className = 'list-group-item';
        priceLi.innerHTML = `<strong>Price:</strong> ${p.price}`;

        const categoryLi = document.createElement('li');
        categoryLi.className = 'list-group-item';
        categoryLi.innerHTML = `<strong>Category:</strong> ${p.category}`;

        const stockLi = document.createElement('li');
        stockLi.className = 'list-group-item';
        stockLi.innerHTML = `<strong>Stock:</strong> ${p.stock}`;

        const idLi = document.createElement('li');
        idLi.className = 'list-group-item';
        idLi.innerHTML = `<strong>ID:</strong> ${p._id}`;

        list.appendChild(codeLi);
        list.appendChild(priceLi);
        list.appendChild(categoryLi);
        list.appendChild(stockLi);
        list.appendChild(idLi);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'card-body';
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.flexDirection = 'column';
        buttonsDiv.style.justifyContent = 'center';
        buttonsDiv.style.alignItems = 'center';
        buttonsDiv.style.gap = '0.6rem';

        const addToCartButton = document.createElement('button');
        addToCartButton.type = 'submit';
        addToCartButton.className = 'add-to-cart';
        addToCartButton.style.display = 'flex';
        addToCartButton.style.height = '2.5rem';
        addToCartButton.style.width = '9rem';
        addToCartButton.style.border = '1px solid black';
        addToCartButton.style.borderRadius = '0.3rem';
        addToCartButton.style.justifyContent = 'center';
        addToCartButton.style.alignItems = 'center';
        addToCartButton.style.gap = '0.4rem';
        addToCartButton.dataset.pid = `${p._id}`;
        addToCartButton.dataset.cid = `${p.cart}`;

        const cartImage = document.createElement('img');
        cartImage.src = '/img/cart.svg';
        cartImage.alt = 'cart';

        const addToCartText = document.createElement('p');
        addToCartText.style.margin = '0';
        addToCartText.style.fontWeight = '500';
        addToCartText.textContent = 'Add to Cart';

        addToCartButton.appendChild(cartImage);
        addToCartButton.appendChild(addToCartText);

        const removeButton = document.createElement('button');
        removeButton.type = 'submit';
        removeButton.className = 'card-link remove-button';
        removeButton.style.display = 'flex';
        removeButton.style.height = '2.5rem';
        removeButton.style.width = '4rem';
        removeButton.style.border = '1px solid black';
        removeButton.style.borderRadius = '0.3rem';
        removeButton.style.justifyContent = 'center';
        removeButton.style.alignItems = 'center';
        removeButton.style.gap = '0.4rem';
        removeButton.style.margin = '0';
        removeButton.dataset.pid = `${p._id}`;
        removeButton.textContent = '🗑️';

        buttonsDiv.appendChild(addToCartButton);
        buttonsDiv.appendChild(removeButton);

        cardDiv.appendChild(image);
        cardDiv.appendChild(cardBodyDiv);
        cardDiv.appendChild(list);
        cardDiv.appendChild(buttonsDiv);

        myDiv.appendChild(cardDiv);

        const buttonsDelete = document.querySelectorAll('.remove-button');

        buttonsDelete.forEach((b) => {
            b.addEventListener('click', () => {
                const pid = b.getAttribute('data-pid');
                socket.emit('delete-Product', pid);
            });
        });

        const buttonsAdd = document.querySelectorAll('.add-to-cart');

        buttonsAdd.forEach((b) => {
            b.addEventListener('click', () => {
                const cid = b.getAttribute('data-cid');
                const pid = b.getAttribute('data-pid');
                socket.emit('pushProduct', { cid, pid });
                alert('added (TODO: modal)');
            });
        });
    });
});

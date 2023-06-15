const socket = io();

socket.on('products', (products) => {
   const productList = document.getElementById('productList');
   productList.innerHTML = '';

   products.forEach((p) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
            <strong>Title:</strong> ${p.title}<br>
            <strong>Description:</strong> ${p.description}<br>
            <strong>Code:</strong> ${p.code}<br>
            <strong>Price:</strong> ${p.price}<br>
            <strong>Stock:</strong> ${p.stock}<br>
            <strong>Category:</strong> ${p.category}<br>
            <strong>Thumbnails:</strong> ${p.thumbnails}<br>
            <strong>Id:</strong> ${p._id}<br><br>
            <button onclick="deleteProduct('${p._id}')">Delete Product</button>
        `;

      productList.appendChild(listItem);
   });
});

const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', (e) => {
   e.preventDefault();

   const { title, description, code, price, stock, category, thumbnails } = e.target.elements;

   const newProduct = {
      title: title.value,
      description: description.value,
      code: code.value,
      price: price.value,
      stock: stock.value,
      category: category.value,
      thumbnails: thumbnails.value,
   };

   socket.emit('new-Product', newProduct);

   productForm.reset();
});

const deleteProduct = (pid) => {
   socket.emit('delete-Product', pid);
};

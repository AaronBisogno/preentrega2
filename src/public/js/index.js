const socket = io();

socket.on('products', (products) => {
   const productList = document.getElementById('productList');
   productList.innerHTML = '';

   products.forEach((product) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
            <strong>Title:</strong> ${product.title}<br>
            <strong>Description:</strong> ${product.description}<br>
            <strong>Code:</strong> ${product.code}<br>
            <strong>Price:</strong> ${product.price}<br>
            <strong>Stock:</strong> ${product.stock}<br>
            <strong>Category:</strong> ${product.category}<br>
            <strong>Thumbnails:</strong> ${product.thumbnails}<br>
            <strong>Id:</strong> ${product.id}<br>
            <button onclick="deleteProduct(${product.id})">Delete Product</button>
        `;

      productList.appendChild(listItem);
   });
});

const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', (event) => {
   event.preventDefault();

   const title = document.getElementById('title').value;
   const description = document.getElementById('description').value;
   const code = document.getElementById('code').value;
   const price = document.getElementById('price').value;
   const stock = document.getElementById('stock').value;
   const category = document.getElementById('category').value;
   const thumbnails = document.getElementById('thumbnails').value;

   const newProduct = {
      title: title,
      description: description,
      code: code,
      price: price,
      stock: stock,
      category: category,
      thumbnails: thumbnails,
   };
   console.log(newProduct);

   socket.emit('new-Product', newProduct);

   productForm.reset();
});

const deleteProduct = (productId) => {
   socket.emit('delete-Product', productId);
};

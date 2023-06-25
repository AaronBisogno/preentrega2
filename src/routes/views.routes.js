import express from 'express';
import { ProductService } from '../services/product.service.js';
import { ProductModel } from '../dao/models/products.model.js';
import { CartService } from '../services/cart.service.js';
import { isUser, userLogged } from '../middlewares/auth.js';

export const viewsRouter = express.Router();
const productService = new ProductService();
const cartService = new CartService();

viewsRouter.get('/', isUser, async (req, res) => {
    let { limit } = req.query;
    let { page } = req.query;

    const user = { firstName: req.session.firstName, lastName: req.session.lastName, admin: req.session.admin };
    const queryResult = await ProductModel.paginate({}, { limit: limit || 10, page: page || 1 });
    const { docs, ...rest } = queryResult;
    const result = docs.map((doc) => {
        return { title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id };
    });

    res.render('home', { result, pagination: rest, title: 'Bull Market | Home', user });
});

viewsRouter.get('/products', isUser, async (req, res) => {
    let { limit } = req.query;
    let { page } = req.query;

    const user = { firstName: req.session.firstName, admin: req.session.admin };
    const queryResult = await ProductModel.paginate({}, { limit: limit || 10, page: page || 1 });
    const { docs, ...rest } = queryResult;
    const result = docs.map((doc) => {
        return { title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id };
    });

    res.render('products', { result, pagination: rest, title: 'Bull Market | Products', user });
});

viewsRouter.get('/products/:pid', isUser, async (req, res) => {
    const user = { firstName: req.session.firstName, admin: req.session.admin };
    try {
        const { pid } = req.params;
        const product = await productService.getProduct(pid);
        res.render('product', { product, title: 'Bull Market | Product', user });
    } catch {
        res.render('404', { title: '404 Page not found', user });
    }
});

viewsRouter.get(`/carts/:cid`, isUser, async (req, res) => {
    const user = { firstName: req.session.firstName, admin: req.session.admin };
    try {
        const { cid } = req.params;
        const cart = await cartService.getCart(cid);
        const { products } = cart;
        const result = [];
        for (const item of products) {
            result.push(item.product);
        }
        res.render('carts', { cart, result, cid, title: 'Bull Market | Cart', user });
    } catch {
        res.render('404', { title: 'Bull Market | 404 Page not found', user });
    }
});

viewsRouter.get('/realtimeproducts', isUser, async (req, res) => {
    const user = { firstName: req.session.firstName, admin: req.session.admin };
    const products = await productService.getProducts();
    res.render('realTimeProducts', { products, title: 'Bull Market | Products', user });
});

viewsRouter.get('/chat', (req, res) => {
    res.render('chat', { title: 'Bull Market | Chat Online' });
});

viewsRouter.get('/login', userLogged, (req, res) => {
    res.render('login', { default: true, title: 'Bull Market | Log In' });
});

viewsRouter.get('/register', userLogged, (req, res) => {
    res.render('register', { default: true, title: 'Bull Market | Create Account' });
});

viewsRouter.get('/account', isUser, (req, res) => {
    const user = { email: req.session.email, firstName: req.session.firstName, lastName: req.session.lastName, age: req.session.age, admin: req.session.admin, birth: req.session.birth };
    res.render('account', { title: 'Bull Market | Account', user });
});

viewsRouter.get('/logout', isUser, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ status: 'Logout ERROR', body: err });
        }
        res.redirect('/login');
    });
});

viewsRouter.get('*', isUser, (req, res) => {
    const user = { firstName: req.session.firstName, admin: req.session.admin };
    res.render('404', { title: 'Bull Market | Page not found', user });
});

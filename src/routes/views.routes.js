import express from 'express';
import { ProductService } from '../services/product.service.js';
import { ProductModel } from '../dao/models/products.model.js';
import { CartService } from '../services/cart.service.js';
import { UserModel } from '../dao/models/user.model.js';
import { isUser, userLogged } from '../middlewares/auth.js';

export const viewsRouter = express.Router();
const productService = new ProductService();
const cartService = new CartService();

viewsRouter.get('/', isUser, async (req, res) => {
    let { limit } = req.query;
    let { page } = req.query;

    const user = { firstName: req.session.firstName, lastName: req.session.lastName, email: req.session.email, admin: req.session.admin };
    const userCart = await UserModel.find({email: user.email});
    const cart = userCart[0].cart.toString();
    const queryResult = await ProductModel.paginate({}, { limit: limit || 10, page: page || 1 });
    const { docs, ...rest } = queryResult;
    const result = docs.map((doc) => {
        return { title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id };
    });

    res.render('home', { result, pagination: rest, title: 'Bull Market | Home', user, cart });
});

viewsRouter.get('/products', isUser, async (req, res) => {
    let { limit } = req.query;
    let { page } = req.query;

    const user = { firstName: req.session.firstName, admin: req.session.admin, email: req.session.email };
    const userCart = await UserModel.find({email: user.email});
    const cart = userCart[0].cart.toString();
    
    const queryResult = await ProductModel.paginate({}, { limit: limit || 10, page: page || 1 });
    const { docs, ...rest } = queryResult;
    const result = docs.map((doc) => {
        return { title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id, cart };
    });
    res.render('products', { result, pagination: rest, title: 'Bull Market | Products', user, cart});
});

viewsRouter.get('/products/:pid', isUser, async (req, res) => {
    const user = { firstName: req.session.firstName, admin: req.session.admin, email: req.session.email };
    const userCart = await UserModel.find({email: user.email});
    const cart = userCart[0].cart.toString();
    try {
        const { pid } = req.params;
        const product = await productService.getProduct(pid);
        res.render('product', { product, title: 'Bull Market | Product', user, cart });
    } catch {
        res.render('404', { title: '404 Page not found', user, cart });
    }
});

viewsRouter.get(`/carts/:cid`, isUser, async (req, res) => {
    const user = { firstName: req.session.firstName, admin: req.session.admin, email: req.session.email };
    const userCart = await UserModel.find({email: user.email});
    const cart = userCart[0].cart.toString();
    try {
        const { cid } = req.params;
        const cart1 = await cartService.getCart(cid);
        const { products } = cart1;
        const result = [];
        for (const item of products) {
            result.push(item.product);
        }
        res.render('carts', { result, cid, title: 'Bull Market | Cart', user, cart });
    } catch {
        res.render('404', { title: 'Bull Market | 404 Page not found', user, cart });
    }
});

viewsRouter.get('/realtimeproducts', isUser, async (req, res) => {
    const user = { firstName: req.session.firstName, admin: req.session.admin, email: req.session.email };
    const userCart = await UserModel.find({email: user.email});
    const cart = userCart[0].cart.toString();
    const products = await productService.getProducts();
    res.render('realTimeProducts', { products, title: 'Bull Market | Products', user, cart });
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

viewsRouter.get('/account', isUser, async (req, res) => {
    const user = { email: req.session.email, firstName: req.session.firstName, lastName: req.session.lastName, age: req.session.age, admin: req.session.admin, birth: req.session.birth };
    const userCart = await UserModel.find({email: user.email});
    const cart = userCart[0].cart.toString();
    res.render('account', { title: 'Bull Market | Account', user, cart });
});

viewsRouter.get('/logout', isUser, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ status: 'Logout ERROR', body: err });
        }
        res.redirect('/login');
    });
});

viewsRouter.get('*', isUser, async (req, res) => {
    const user = { firstName: req.session.firstName, admin: req.session.admin, email: req.session.email };
    res.render('404', { title: 'Bull Market | Page not found', user, cart });
});

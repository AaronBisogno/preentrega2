import { ProductModel } from '../dao/models/products.model.js';
export function isUser(req, res, next) {
    if (req.session?.email) {
        return next();
    } else return res.status(401).render('login', { default: true });
}

export async function userLogged(req, res, next) {
    if (req.session?.email) {
        let { limit } = req.query;
        let { page } = req.query;
        const user = { firstName: req.session.firstName, lastName: req.session.lastName, admin: req.session.admin };
        const queryResult = await ProductModel.paginate({}, { limit: limit || 10, page: page || 1 });
        const { docs, ...rest } = queryResult;
        const result = docs.map((doc) => {
            return { title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, category: doc.category, thumbnail: doc.thumbnail, id: doc.id };
        });
        return res.render('home', { result, pagination: rest, title: 'Bull Market | Home', user });
    } else return next();
}

export function isAdmin(req, res, next) {
    if (req.session?.isAdmin) {
        return next();
    }
    return res.status(403).render('error', { error: 'Authentication error!' });
}

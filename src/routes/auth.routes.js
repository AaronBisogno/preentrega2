import express from 'express';
import { UserModel } from '../dao/models/user.model.js';
import { UserService } from '../services/user.service.js';
import { userLogged } from '../middlewares/auth.js';
import { CartService } from '../services/cart.service.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';

export const authRouter = express.Router();
const userService = new UserService();
const cartService = new CartService();

authRouter.post('/login', userLogged, async (req, res) => {
    const { userEmail, userPass } = req.body;
    const user = await UserModel.findOne({ email: userEmail });
    if (user && isValidPassword(userPass, user.password)) {
        req.session.email = user.email;
        req.session.firstName = user.firstName;
        req.session.lastName = user.lastName;
        req.session.admin = user.isAdmin;
        req.session.birth = user.birth;
        req.session.age = user.age;
        return res.redirect('/');
    } else {
        return res.status(401).render('loginError', { default: true, title: 'Bull Market | Log In' });
    }
});

authRouter.post('/register', userLogged, async (req, res) => {
    const { firstName, lastName, userEmail, monthBirth, dayBirth, yearBirth, userPass } = req.body;
    const password = createHash(userPass)
    try {
        const dateOfBirth = yearBirth + '-' + monthBirth + '-' + dayBirth;
        const age = userService.calculateAge(dateOfBirth);

        const user = {
            firstName,
            lastName,
            email: userEmail,
            age,
            birth: dateOfBirth,
            password,
            cart: await cartService.create()
        }
        
        await userService.createUser(user);

        res.status(200).redirect('/');
    } catch (error) {
        res.status(500).send('Error: ' + error);
    }
});

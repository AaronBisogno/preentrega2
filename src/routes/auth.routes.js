import express from 'express';
import { UserModel } from '../dao/models/user.model.js';
import { UserService } from '../services/user.service.js';
import { isAdmin, isUser } from '../middlewares/auth.js';

export const authRouter = express.Router();
const userService = new UserService();

authRouter.get('/login', (req, res) => {
    res.render('login', { default: true, title: 'Bull Market | Log In' });
});

authRouter.get('/register', (req, res) => {
    res.render('register', { default: true, title: 'Bull Market | Create Account' });
});

authRouter.get('/account', (req, res) => {
    const user = { email: req.session.email, firstName: req.session.firstName, lastName: req.session.lastName, admin: req.session.admin };
    console.log(user);
    res.render('account', { default: true, title: 'Bull Market | Create Account', user });
});

authRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ status: 'Logout ERROR', body: err });
        }
        res.redirect('/login');
    });
});

authRouter.post('/login', async (req, res) => {
    const { userEmail, userPass } = req.body;
    const user = await UserModel.findOne({ email: userEmail });
    console.log(user);
    if (user && user.password === userPass) {
        req.session.email = user.email;
        req.session.firstName = user.firstName;
        req.session.lastName = user.lastName;
        req.session.admin = user.isAdmin;
        req.session.email = user.email;
        return res.redirect('/');
    } else {
        return res.status(401).render('error', { error: 'Wrong user/password' });
    }
});

authRouter.post('/register', async (req, res) => {
    const { firstName, lastName, userEmail, monthBirth, dayBirth, yearBirth, userPass } = req.body;
    try {
        const dateOfBirth = yearBirth + '-' + monthBirth + '-' + dayBirth;

        const age = userService.calculateAge(dateOfBirth);

        await userService.createUser(firstName, lastName, userEmail, age, userPass);

        res.status(200).redirect('/');
    } catch (error) {
        res.status(500).send('Error: ' + error);
    }
});

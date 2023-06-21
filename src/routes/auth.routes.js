import express from 'express';
import { UserModel } from '../dao/models/user.model.js';
import { UserService } from '../services/user.service.js';
import { isAdmin, isUser } from '../middlewares/auth.js';

export const authRouter = express.Router();
const userService = new UserService();

authRouter.post('/login', async (req, res) => {
    const { userEmail, userPass } = req.body;
    const user = await UserModel.findOne({ email: userEmail });
    if (user && userPass === user.password) {
        req.session.email = user.email;
        req.session.firstName = user.firstName;
        req.session.lastName = user.lastName;
        req.session.admin = user.isAdmin;
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

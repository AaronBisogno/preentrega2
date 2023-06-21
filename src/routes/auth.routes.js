import express from 'express';
import { UserService } from '../services/user.service.js';

export const authRouter = express.Router();
const userService = new UserService();

authRouter.post('/login', async (req, res) => {
    const {userEmail, userPass} = req.body;
    const user = await userService.loginUser(userEmail, userPass)
    return res.redirect('/')
})

authRouter.post('/register', async (req, res) => {
    const { firstName, lastName, userEmail, monthBirth, dayBirth, yearBirth, userPass } = req.body;
    try {
        const dateOfBirth = yearBirth + '-' + monthBirth + '-' + dayBirth;

        const age = userService.calculateAge(dateOfBirth);

        await userService.createUser(firstName, lastName, userEmail, age, userPass);

        res.status(200).redirect('/')

    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});
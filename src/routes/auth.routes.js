import express from 'express';
import { userLogged } from '../middlewares/auth.js';
import passport from 'passport';

export const authRouter = express.Router();

authRouter.get('/auth/github', userLogged, passport.authenticate('github', { scope: ['user:email'] }));

authRouter.get('/github/callback', userLogged, passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    console.log(req.user);
    if (req.user) {
        req.session.user = {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            admin: req.user.isAdmin,
            birth: req.user.birth,
            age: req.user.age,
        };
        res.redirect('/');
    }
});

authRouter.post(
    '/login',
    userLogged,
    passport.authenticate('login', {
        failureRedirect: '/loginError',
    }),
    (req, res) => {
        if (req.user) {
            req.session.user = {
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                admin: req.user.isAdmin,
                birth: req.user.birth,
                age: req.user.age,
            };
            res.redirect('/');
        }
    }
);

authRouter.get('/loginError', userLogged, async (req, res) => {
    return res.status(401).render('loginError', { default: true, title: 'Bull Market | Log In' });
});

authRouter.post(
    '/register',
    userLogged,
    passport.authenticate('register', {
        successRedirect: '/login',
        failureRedirect: '/failRegister',
    })
);

authRouter.get('/failRegister', async (req, res) => {
    return res.redirect('/register');
});

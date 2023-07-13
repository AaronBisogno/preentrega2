import express from 'express';

export const sessionRouter = express.Router();

sessionRouter.get('/current', (req, res) => {
    const user = {
        email: req.session.user.email,
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName,
        age: req.session.user.age,
        admin: req.session.user.admin,
        birth: req.session.user.birth,
    };
    res.status(200).send({user})
})

import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { UserModel } from '../dao/models/user.model.js';
import { CartService } from '../services/cart.service.js';
import { UserService } from '../services/user.service.js';

const userService = new UserService();
const cartService = new CartService();

const LocalStrategy = local.Strategy;

export function iniPassport() {
    passport.use(
        'register',
        new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { firstName, lastName, monthBirth, dayBirth, yearBirth } = req.body;
            try {
                let user = await UserModel.findOne({ email: username });
                if (user) {
                    console.log('User already exists');
                    return done(null, false);
                }
                const dateOfBirth = yearBirth + '-' + monthBirth + '-' + dayBirth;
                const age = userService.calculateAge(dateOfBirth);

                const newUser = {
                    firstName,
                    lastName,
                    email: username,
                    age,
                    birth: dateOfBirth,
                    password: createHash(password),
                    cart: await cartService.create(),
                };

                let result = await userService.createUser(newUser);

                return done(null, result);
            } catch (err) {
                return done('Error getting user' + err);
            }
        })
    );

    passport.use(
        'login',
        new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username });
                if (user && isValidPassword(password, user.password)) {
                    return done(null, user);
                } else {
                    console.log('auth invalid, try again');
                    return done(null, false);
                }
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
    });
}

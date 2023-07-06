import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
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
                    age: age,
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

    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/github/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
            const res = await fetch('https://api.github.com/user/emails', {
              headers: {
                Accept: 'application/vnd.github+json',
                Authorization: 'Bearer ' + accessToken,
                'X-Github-Api-Version': '2022-11-28',
              },
            });
            const emails = await res.json();
            const emailDetail = emails.find(email => email.verified === true);
  
            if (!emailDetail) {
              return done(new Error('cannot get a valid email for this user'));
            }
            profile.email = emailDetail.email;
  
            let user = await UserModel.findOne({ email: profile.email });
            if (!user) {
              const newUser = {
                email: profile.email,
                firstName: profile._json.name || profile._json.login || 'noname',
                lastName: 'nolast',
                isAdmin: false,
                password: 'nopass',
                cart: await cartService.create()
              };
              let userCreated = await UserModel.create(newUser);
              console.log('User Registration succesful');
              return done(null, userCreated);
            } else {
              console.log('User already exists');
              return done(null, user);
            }
          } catch (e) {
            console.log('Error en auth github');
            console.log(e);
            return done(e);
          }  
      }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
    });
}

export function isUser(req, res, next) {
    if (req.session?.user?.email) {
        return next();
    } else return res.status(401).redirect('/login');
}

export async function userLogged(req, res, next) {
    if (req.session?.user?.email) {
        return res.redirect('/');
    } else return next();
}

export function isAdmin(req, res, next) {
    if (req.session?.user?.admin) {
        return next();
    }
    return res.status(403).render('error', { error: 'Authentication error!' });
}

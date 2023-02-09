const jwt = require('jsonwebtoken');
const User = require('../models/User');


const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'net ninja secret', (err, decodedToken) => { //veirfy token //ninjasecret is the secret key(athController.js)
            if (err) {
                console.log(err.message);
                console.log('token not verified');
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                console.log('token verified');
                next();
            }
        });

    } else {
        res.redirect('/login');
    }
};

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'net ninja secret', async (err, decodedToken) => { //veirfy token //ninjasecret is the secret key(athController.js)
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user; // res.locals is an object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.
                //console.log('token verified');
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkUser };
const express = require('express');
const router = express.Router();
const { check} = require('express-validator');
const general_controller = require('../controllers/generalController');
const user_controller = require('../controllers/userController');

const checkUser = function (req, res, next) {
    if (req.session.userId) {
        console.log(req.session);
        next();
    } else {
        res.render('user/login', { title: "Login Here" });
    }
};

router.get('/', checkUser, general_controller.index);
router.get('/aboutus', checkUser, general_controller.getAboutPage);

router.get('/profile', checkUser, user_controller.getUserProfile);
router.get('/register', user_controller.getUserData);
router.get('/login', user_controller.getLoginPage);


router.post('/register',
    [
        check('username').not().isEmpty().withMessage('please enter user name'),
        check('email', 'please enter email').not().isEmpty(),
        check('email', 'please enter valid email').isEmail(),
        check('password', 'please enter password').not().isEmpty(),
        check('password', 'minimum 5 characters required').isLength({ min: 5 }).custom((value, { req, loc, path }) => {
            if (value !== req.body.password2) {
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        }),
        check('password2', 'please enter confirm password').not().isEmpty(),

    ], user_controller.registerUser);

router.post('/login', [
    check('username').not().isEmpty().withMessage('please enter user name'),
    check('password', 'please enter password').not().isEmpty(),
], user_controller.loginUser);


router.get('/logout', user_controller.logoutUser);
router.get('/*', checkUser, general_controller.redirectUnknownLink);


module.exports = router;
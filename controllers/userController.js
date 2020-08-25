const bcrypt = require('bcrypt');
const saltRounds = 10;
const { validationResult } = require('express-validator');
const User = require('../models/user');
const passport = require('passport');

exports.getUserData = function (req, res) {
    res.render('user/register');
};

exports.getLoginPage = function (req, res) {
    res.render('user/login');
};

exports.getUserProfile = function (req, res) {
    User.findOne({ _id: req.session.userId }, function (err, user) {
        if (user) {
            res.render('profile', { pagename: 'Profile', userName: user.username, email: user.email });
        }
    })
};

exports.registerUser = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    }
    else {
        User.findOne({ $or: [{ 'email': req.body.email }, { 'username': req.body.username }] }, function (err, user) {
            if (user) {
                return res.status(422).jsonp([{ msg: "username or email already exist, please try something new" }]);
            }
            else {
                console.log("registering new user");
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        console.log(hash);
                        let newUser = new User({
                            username: req.body.username,
                            email: req.body.email,
                            password: hash
                        });
                        newUser.save(function (err, response) {
                            if (err) console.log(err);
                            if (response) {
                                req.session.userId = response._id;
                                return res.status(200).jsonp([{ msg: "success" }]);
                            }
                        });
                    });
                });
            }
        });
    }
};

exports.loginUser = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    }
    else {
        passport.authenticate('local', function (err, user) {
            if (err)
                res.render('user/login');
            if (user) {
                req.session.userId = user._id;
                return res.status(200).jsonp([{ msg: "succesfully logged in" }]);
            }
            else {
                return res.status(422).jsonp([{ msg: "incorrect username or password" }]);
            }
        })(req, res);
    }
};

exports.logoutUser = function (req, res) {
    req.logOut();
    res.clearCookie('connect.sid');
    req.session.destroy();
    res.redirect('/login');
    res.end();
};

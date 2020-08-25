
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = function(passport) {
    passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
              bcrypt.compare(password, user.password,function(err,res) {
                  if(err){ return done(err);}
                  if (!res) { return done(null, false,{ messege:'wrong password' }); }
                  if(res) { return done(null, user); }
              });
            
           });
        }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user); 
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
} 

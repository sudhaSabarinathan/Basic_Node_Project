const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const expressValidator= require('express-validator');
const mongoose = require('mongoose');

const pageRouter = require('./routes/index');

const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const MongoStore= require('connect-mongo')(session)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.set('layout', 'layouts/layout');
app.set('layout', 'layouts/layout');

require('dotenv').config();
app.use(session({
    secret:process.env.Secret_key,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url: process.env.Db_Connection,
      autoRemove: 'interval',
      autoRemoveInterval: 1
    })
}));
app.use(expressLayout);
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(expressValidator.check());
app.use(expressValidator.body());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/files', express.static('public'));
app.use('/', pageRouter);

let db = mongoose.connection;

mongoose.connect(process.env.Db_Connection);
db.once('open',function(){
   console.log("mongodb connection established");
});
db.on('reconnected', function () {
  console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
  console.log('MongoDB disconnected!');
  mongoose.connect(process.env.Db_Connection, {auto_reconnect:true});
});

db.on('error', function(error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

module.exports = app;
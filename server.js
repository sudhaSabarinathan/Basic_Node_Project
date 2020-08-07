const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');

const pageRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayout);
app.use('/files', express.static('public'));
app.use('/', pageRouter);

require('dotenv').config();
module.exports = app;
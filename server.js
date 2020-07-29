const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose');

const pageRouter = require('./routes/index') 

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayout)
app.use(express.static('public'))

//mongoose.connect()
app.use('/', pageRouter);

app.listen(process.env.Port || 4000)
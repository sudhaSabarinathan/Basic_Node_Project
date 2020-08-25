const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.Db_Connection);

const newUserSChema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = module.exports = mongoose.model("User", newUserSChema);
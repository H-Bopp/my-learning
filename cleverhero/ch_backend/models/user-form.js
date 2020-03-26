const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userFormShema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    token: { type: String, required: true, unique:true },
    phoneChecker: { type: String, required: true },
    emailChecker: { type: String, required: true }
});

userFormShema.plugin(uniqueValidator);

module.exports = mongoose.model('Userform', userFormShema);
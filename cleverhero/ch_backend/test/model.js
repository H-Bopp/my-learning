const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const tableShema = mongoose.Schema({
    token: { type: String, required: true, unique: true},
    autres: { type: String, required: true}
});

tableShema.plugin(uniqueValidator);

module.exports = mongoose.model('Table', tableShema);
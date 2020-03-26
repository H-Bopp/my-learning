const express = require('express');
const router = express.Router();

const ctrl = require('./controller');

router.post('/exemple', ctrl.traitementExemple);


module.exports = router;
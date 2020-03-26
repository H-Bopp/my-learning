const express = require('express');
const router = express.Router();

const userFormCtrl = require('../controllers/user-form');

router.post('/user/form/informations', userFormCtrl.addUser);
router.post('/user/form/verfications', userFormCtrl.checkUser);

module.exports = router;
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup/informations', userCtrl.saveUserForm);
router.post('/signup/creation', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
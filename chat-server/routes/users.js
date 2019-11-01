var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
var userController = require('../controllers/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.get('/getAllUsers', userController.getAllUsers);
router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/sendMessage', userController.sendMessage);
router.post('/getMessageByChatRoom', userController.getMessageByChatRoom);

module.exports = router;

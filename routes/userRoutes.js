const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getUsers', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/createUser', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/login',userController.loginUser);
router.post('/reset-password', userController.resetPassword);


module.exports = router;

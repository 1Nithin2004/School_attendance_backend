const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getUsers', userController.getUsers);
router.post('/createUser', userController.createUser);
router.post('/login',userController.loginUser);
router.post('/reset-password', userController.resetPassword);
router.get('/class/:class_id', userController.getClassStudents);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);
router.put('/:id', userController.updateUser);

module.exports = router;

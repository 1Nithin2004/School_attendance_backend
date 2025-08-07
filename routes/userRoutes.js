const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getUsers', userController.getUsers);
router.get('/getTeachers', userController.getTeachers);
router.get('/getStudents',userController.getStudents);
router.post('/createUser', userController.createUser);
router.post('/addTeacher', userController.addTeacher);
router.post('/login',userController.loginUser);
router.post('/reset-password', userController.resetPassword);
router.get('/class/:class_id', userController.getClassStudents);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);
router.put('/:id', userController.updateUser);
router.post('/addstudent', userController.addStudent);
router.delete("/teachers/:id", userController.deleteTeacher);
router.delete('/students/:id', userController.deleteStudent);

module.exports = router;
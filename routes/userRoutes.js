const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Specific routes first
router.get('/getUsers', userController.getUsers);
router.get('/getTeachers', userController.getTeachers);
router.get('/getStudents', userController.getStudents);
router.get('/class/:class_id', userController.getClassStudents);
router.get('/teachers/:id', userController.getTeacherById);

// Parent attendance by email
router.get('/parent/:email/attendance', userController.getParentAttendance);
router.get('/parent/name/:email', userController.getParentNameByEmail);

// POST routes
router.post('/createUser', userController.createUser);
router.post('/addTeacher', userController.addTeacher);
router.post('/login', userController.loginUser);
router.post('/reset-password', userController.resetPassword);
router.post('/addstudent', userController.addStudent);

// DELETE routes
router.delete("/teachers/:id", userController.deleteTeacher);
router.delete('/students/:id', userController.deleteStudent);
router.delete('/:id', userController.deleteUser);

// PUT routes
router.put('/updateStudent/:id', userController.updateStudent);
router.put('/:id', userController.updateUser);
router.put('/teachers/:id', userController.updateTeacher);

// Generic GET route last
router.get('/:id', userController.getUserById);

module.exports = router;
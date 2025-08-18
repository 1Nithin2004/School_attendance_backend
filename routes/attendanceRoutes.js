const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/mark', attendanceController.markAttendance);
router.get('/attendance/report/:classId', attendanceController.getAttendanceReport);

router.get('/student/:studentId/report', attendanceController.getStudentReport);

router.get('/report/:classId', attendanceController.getAttendanceReport);
router.get('/parent/:parentName/attendance', attendanceController.getParentChildrenAttendance);

module.exports = router;

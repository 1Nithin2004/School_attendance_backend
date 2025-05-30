const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/mark', attendanceController.markAttendance);

router.get('/student/:studentId/report', attendanceController.getStudentReport);

// ✅ Add report route
router.get('/report/:classId', attendanceController.getAttendanceReport);

module.exports = router;

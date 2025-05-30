const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

// GET timetable by class ID
router.get('/:classId', timetableController.getTimetableByClassId);

// POST route to insert timetable
router.post('/', timetableController.addTimetable);

module.exports = router;

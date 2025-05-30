const db = require('../config/db');
const TimetableModel = require('../models/timetableModel');

// Add new timetable entry
exports.addTimetable = (req, res) => {
  const timetableData = req.body;

  TimetableModel.createTimetable(timetableData, (err, result) => {
    if (err) {
      console.error('❌ Error inserting timetable:', err);
      return res.status(500).json({ message: 'Database error while inserting timetable.' });
    }

    res.status(201).json({
      message: '✅ Timetable added successfully',
      id: result.insertId
    });
  });
};

// Get timetable by class ID
exports.getTimetableByClassId = (req, res) => {
  const classId = req.params.classId;

  const query = `
    SELECT 
      t.period, 
      c.class_name, 
      s.subject_name, 
      u.Full_Name AS teacher_name, 
      t.day, 
      t.start_time, 
      t.end_time
    FROM timetable t
    LEFT JOIN classes c ON c.id = t.class_id
    LEFT JOIN subjects s ON s.id = t.subject_id
    LEFT JOIN user u ON u.Id = t.teacher_id
    WHERE t.class_id = ?
  `;

  db.query(query, [classId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching timetable:', err);
      return res.status(500).json({ error: 'Internal server error while fetching timetable.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: `No timetable found for class ID ${classId}.` });
    }

    return res.status(200).json(results);
  });
};

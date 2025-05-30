const db = require('../config/db');

exports.createTimetable = (data, callback) => {
  const query = `
    INSERT INTO timetable (period, class_id, subject_id, teacher_id, day, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.period,
    data.class_id,
    data.subject_id,
    data.teacher_id,
    data.day,
    data.start_time,
    data.end_time
  ];

  db.query(query, values, (err, results) => {
    callback(err, results);
  });
};

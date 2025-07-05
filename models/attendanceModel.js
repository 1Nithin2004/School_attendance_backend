const db = require('../config/db');

const Attendance = require('../models/attendanceModel');

exports.markAttendance = (data, callback) => {
    const { studentId, classId, date, teacherId, status } = data;

    const checkQuery = `
        SELECT * FROM attendance 
        WHERE student_id = ? AND class_id = ? AND date = ?
    `;

    db.query(checkQuery, [studentId, classId, date], (err, results) => {
        if (err) return callback(err);

        if (results.length > 0) {
            return callback({
                message: 'Attendance already marked for this student in this class on this date.'
            });
        }

        const insertQuery = `
            INSERT INTO attendance (student_id, class_id, date, teacher_id, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [studentId, classId, date, teacherId, status], callback);
    });
};

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

exports.getAttendanceReport = (classId, callback) => {
    const query = `
        SELECT student_id, 
               COUNT(CASE WHEN status = 'present' THEN 1 END) AS present_classes,
               COUNT(*) AS total_classes
        FROM attendance
        WHERE class_id = ?
        GROUP BY student_id
    `;

    db.query(query, [classId], callback); // Ensure callback is triggered with data or error
};

exports.getStudentReport = (studentId, callback) => {
    const query = `
        SELECT 
            COUNT(*) AS total_days,
            COUNT(CASE WHEN status = 'present' THEN 1 END) AS present_days,
            COUNT(CASE WHEN status = 'absent' THEN 1 END) AS absent_days
        FROM attendance
        WHERE student_id = ?
    `;

    db.query(query, [studentId], (err, results) => {
        if (err) return callback(err);

        const { total_days, present_days, absent_days } = results[0];
        const percentage = total_days > 0 
            ? ((present_days / total_days) * 100).toFixed(2)
            : 0;

        callback(null, {
            student_id: studentId,
            total_days,
            present_days,
            absent_days,
            percentage
        });
    });
};

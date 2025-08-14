const db = require('../config/db');

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

exports.getParentChildrenAttendance = (parentName, callback) => {
    const query = `
        SELECT u.Id AS student_id, u.Full_Name,
               COUNT(a.id) AS totalDays,
               SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS presentDays,
               SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absentDays
        FROM user u
        LEFT JOIN attendance a ON u.Id = a.student_id
        WHERE u.Parents_name = ? AND u.User_type='student'
        GROUP BY u.Id, u.Full_Name
    `;

    db.query(query, [parentName], callback);
};



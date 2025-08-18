const db = require('../config/db'); // Database connection
const Attendance = require('../models/attendanceModel'); // Adjust path if needed

// Mark attendance
exports.markAttendance = (req, res) => {
    const { studentId, classId, date, teacherId, status } = req.body;

    if (!studentId || !classId || !date || !teacherId || !status) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const attendanceData = { studentId, classId, date, teacherId, status };

    Attendance.markAttendance(attendanceData, (err, result) => {
        if (err) {
            if (err.message) return res.status(409).json({ message: err.message }); // Conflict
            return res.status(500).json({ error: err });
        }

        res.status(200).json({ message: 'Attendance marked successfully.' });
    });
};

// Get parent’s children attendance
exports.getParentChildrenAttendance = (req, res) => {
    const parentName = req.params.parentName; // Use the parent’s name from URL

    const query = `
        SELECT u.Id AS student_id, u.Full_Name,
               COUNT(a.id) AS totalDays,
               SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS presentDays,
               SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absentDays
        FROM user u
        LEFT JOIN attendance a ON u.Id = a.student_id
        WHERE u.Parents_name = ? 
        GROUP BY u.Id, u.Full_Name
    `;

    db.query(query, [parentName], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        const report = results.map(result => {
            const present = result.presentDays || 0;
            const total = result.totalDays || 0;
            const absent = result.absentDays || 0;
            const percentage = total > 0 ? (present / total) * 100 : 0;

            return {
                student_id: result.student_id,
                name: result.Full_Name,
                total_days: total,
                present_days: present,
                absent_days: absent,
                attendance_percentage: Number(percentage.toFixed(2)).toString(),
                status: percentage >= 70 ? 'green' : (percentage >= 50 ? 'yellow' : 'red')
            };
        });

        res.status(200).json(report);
    });
};

// Get attendance report by class
exports.getAttendanceReport = (req, res) => {
    const classId = req.params.classId;

    const query = `
        SELECT a.student_id,
               u.Full_Name AS name,
               COUNT(CASE WHEN a.status='Present' THEN 1 END) AS present_classes,
               COUNT(*) AS total_classes
        FROM attendance a
        JOIN user u ON a.student_id = u.Id
        WHERE a.class_id = ?
        GROUP BY a.student_id, u.Full_Name
    `;

    db.query(query, [classId], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        const report = results.map(result => {
            const presentClasses = result.present_classes || 0;
            const totalClasses = result.total_classes || 0;
            const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

            return {
                student_id: result.student_id,
                name: result.name,
                attendance_percentage: attendancePercentage.toFixed(2),
                status: attendancePercentage < 70 ? 'red' : 'green'
            };
        });

        res.status(200).json(report);
    });
};

// Get single student report
exports.getStudentReport = (req, res) => {
    const studentId = req.params.studentId;

    Attendance.getStudentReport(studentId, (err, report) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch student report.' });
        res.json(report);
    });
};

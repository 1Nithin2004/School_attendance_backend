const db = require('../config/db'); // or wherever your DB connection is

const Attendance = require('../models/attendanceModel'); // ✅ Adjust path if needed

// Mark attendance function
exports.markAttendance = (req, res) => {
    const { studentId, classId, date, teacherId, status } = req.body;

    if (!studentId || !classId || !date || !teacherId || !status) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const attendanceData = { studentId, classId, date, teacherId, status };

    Attendance.markAttendance(attendanceData, (err, result) => {
        if (err) {
            if (err.message) {
                return res.status(409).json({ message: err.message }); // Conflict
            }
            return res.status(500).json({ error: err });
        }

        res.status(200).json({ message: 'Attendance marked successfully.' });
    });
};

// Get attendance report function
exports.getAttendanceReport = (req, res) => {
    const classId = req.params.classId;

    const query = `
        SELECT 
            a.student_id,
            u.Full_Name AS name,
            COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_classes,
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

exports.getStudentReport = (req, res) => {
    const studentId = req.params.studentId;

    Attendance.getStudentReport(studentId, (err, report) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch student report.' });
        }
        res.json(report);
    });
};

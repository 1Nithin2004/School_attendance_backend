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
        SELECT student_id, 
               COUNT(CASE WHEN status = 'present' THEN 1 END) AS present_classes,
               COUNT(*) AS total_classes
        FROM attendance
        WHERE class_id = ?
        GROUP BY student_id
    `;

    db.query(query, [classId], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        // Calculate attendance percentage and check for division by zero
        const report = results.map(result => {
            const presentClasses = result.present_classes || 0;  // Ensure it defaults to 0 if null
            const totalClasses = result.total_classes || 0;  // Ensure it defaults to 0 if null

            // If totalClasses is 0, set attendance percentage to 0 to avoid NaN
            const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

            return {
                student_id: result.student_id,
                attendance_percentage: attendancePercentage.toFixed(2), // Round to 2 decimal places
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

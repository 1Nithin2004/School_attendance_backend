const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const timetableRoutes = require('./routes/timetableRoutes'); // ✅ Import timetable route

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define routes
app.use('/users', userRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/timetable', timetableRoutes); // ✅ Add timetable route

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

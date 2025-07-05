const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const classlistRoutes = require('./routes/classlistRoutes');

const app = express();
// app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define routes
app.use('/users', userRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/timetable', timetableRoutes);
app.use('/classlist',classlistRoutes);

app.get('/nithin', (req, res) => {
    res.send("hi")
})

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

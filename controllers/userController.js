const User = require('../models/userModel');

exports.getUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) throw err;
        res.json(results);
    });
};
exports.getTeachers = (req, res) => {
    User.getTeachers((err, results) => {
        if (err) {
            console.error("Error fetching teachers:", err);
            return res.status(500).json({ error: "Failed to fetch teachers" });
        }
        res.json(results);
    });
};
exports.deleteTeacher = (req, res) => {
    const teacherId = req.params.id;

    User.deleteTeacher(teacherId, (err, result) => {
        if (err) {
            console.error('Error deleting teacher:', err);
            return res.status(500).json({ message: 'Failed to delete teacher' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Teacher not found or not a teacher' });
        }

        res.status(200).json({ message: 'Teacher deleted successfully' });
    });
};
exports.deleteStudent = (req, res) => {
    const studentId = req.params.id;

    User.deleteStudent(studentId, (err, result) => {
        if (err) {
            console.error('Error deleting student:', err);
            return res.status(500).json({ message: 'Failed to delete student' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found or not a student' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    });
};

exports.updateTeacher = (req, res) => {
    const { Full_Name, Class, Phone_Number, email_address, Password } = req.body;

    const updatedData = {
        ...(Full_Name && { Full_Name }),
        ...(Class && { Class }),
        ...(Phone_Number && { Phone_Number }),
        ...(email_address && { email_address }),
        ...(Password && { Password }),
    };

    User.update(req.params.id, updatedData, (err, result) => {
        if (err) {
            console.error("Error updating teacher:", err);
            return res.status(500).json({ error: "Failed to update teacher" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.json({ message: "Teacher updated successfully" });
    });
};
exports.updateStudent = (req, res) => {
    const { Full_Name, Class, Phone_Number, email_address, Parents_name, Password, Date_of_Birth } = req.body;

    const updatedData = {
        ...(Full_Name && { Full_Name }),
        ...(Class && { Class }),
        ...(Phone_Number && { Phone_Number }),
        ...(email_address && { email_address }),
        ...(Parents_name && { Parents_name }),
        ...(Password && { Password }),
        ...(Date_of_Birth && { Date_of_Birth })
    };

    User.update(req.params.id, updatedData, (err, result) => {
        if (err) {
            console.error("Error updating student:", err);
            return res.status(500).json({ error: "Failed to update student" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student updated successfully" });
    });
};

// A new function in userController.js
exports.getTeacherById = (req, res) => {
    User.getById(req.params.id, (err, result) => {
        if (err) throw err;
        if (result[0] && result[0].User_type === 'Teacher') {
            const user = {
                ...result[0],
                // Your date formatting logic here
            };
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    });
};

exports.getStudents = (req, res) => {
    User.getStudents((err, results) => {
        if (err) {
            console.error("Error fetching students:", err);
            return res.status(500).json({ error: "Failed to fetch students" });
        }
        res.json(results);
    });
};

exports.getUserById = (req, res) => {
    User.getById(req.params.id, (err, result) => {
        if (err) throw err;
        if (result[0]) {
            const user = {
                ...result[0],
                Date_of_Birth: new Date(result[0].Date_of_Birth).toLocaleDateString('en-GB', {
                    timeZone: 'Asia/Kolkata'
                })
            };
            res.status(200).json(user);
        } else {
            // Send a 404 Not Found response with a clear message or an empty object
            res.status(404).json({});
        }
    });
};


// Get all students in Class 6
exports.getClassStudents = (req, res) => {
    User.getClass6(req.params.class_id, (err, results) => {
        if (err) return res.status(500).json({ error: err });
       return res.status(200).json(results);
    });
};

exports.createUser = (req, res) => {
    User.create(req.body, (err, result) => {
        if (err) throw err;
        res.json({ message: 'User created', id: result.insertId });
    });
};

exports.updateUser = (req, res) => {
    const { Full_Name, Class, Phone_Number, email_address, Parents_name, Password, Date_of_Birth, User_type, Profile_pic } = req.body;

    const updatedData = {
        ...(Full_Name && { Full_Name }),
        ...(Class && { Class }),
        ...(Phone_Number && { Phone_Number }),
        ...(email_address && { email_address }),
        ...(Parents_name && { Parents_name }),
        ...(Password && { Password }),
        ...(Date_of_Birth && { Date_of_Birth }),
        ...(User_type && { User_type }),
        ...(Profile_pic && { Profile_pic })
    };

    User.update(req.params.id, updatedData, (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'User updated successfully' });
    });
};


exports.deleteUser = (req, res) => {
    User.delete(req.params.id, (err) => {
        if (err) throw err;
        res.json({ message: 'User deleted' });
    });   
};

exports.loginUser = (req, res) => {
    const { email_address, password } = req.body;

    if (!email_address || !password) {
        return res.status(400).json({ message: 'email_address and password are required.' });
    }

    User.login(email_address, password, (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = results[0];

        // Respond based on user_type
        if (user.User_type === 'Teacher') {
            res.status(200).json({ message: 'Teacher login successful', user });
        } else if (user.User_type === 'Parent') {
            res.status(200).json({ message: 'Parent login successful', user });
        } else if (user.User_type === 'admin') {
            res.status(200).json({ message: 'Admin login successful', user });
        } else {
            res.status(200).json({ message: 'Unknown user type', user });
        }
    });
};
exports.resetPassword = (req, res) => {
    const { email_address, newPassword, confirmPassword } = req.body;

    if (!email_address || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    User.resetPassword(email_address, newPassword, (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        res.status(200).json({ message: 'Password reset successfully' });
    });
};
exports.addTeacher = (req, res) => {
    const { name, email, phoneNumber, password } = req.body;

    if (!name || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const teacherData = {
        Full_Name: name,
        email_address: email,
        Phone_Number: phoneNumber,
        Password: password,
        User_type: 'Teacher'  // ensure 'Teacher' matches what's stored in DB
    };

    User.create(teacherData, (err, result) => {
        if (err) {
            console.error('Error adding teacher:', err);
            return res.status(500).json({ message: 'Error creating teacher', error: err });
        }

        res.status(201).json({ message: 'Teacher added successfully', id: result.insertId });
    });
};
exports.addStudent = (req, res) => {
    const {
        name,
        email,
        phoneNumber,
        password,
        parentsName,
        dob,
        studentClass
    } = req.body;

    if (!name || !email || !phoneNumber || !password || !parentsName || !dob || !studentClass) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const studentData = {
        Full_Name: name,
        email_address: email,
        Phone_Number: phoneNumber,
        Password: password,
        Parents_name: parentsName,
        Date_of_Birth: dob,
        Class: studentClass,
        User_type: 'Parent' // to distinguish in DB
    };

    User.create(studentData, (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            return res.status(500).json({ message: 'Error creating student', error: err });
        }

        res.status(201).json({ message: 'Student added successfully', id: result.insertId });
    });
};

exports.getParentNameByEmail = (req, res) => {
    const email = req.params.email;
    const query = `SELECT Parents_name FROM user WHERE email_address = ? AND User_type='parent'`;
    
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ message: "Parent not found" });
        
        res.json({ parentName: results[0].Parents_name });
    });
};

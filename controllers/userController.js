const User = require('../models/userModel');

exports.getUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

exports.getUserById = (req, res) => {
    User.getById(req.params.id, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
};

exports. createUser = (req, res) => {
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
        } else if (user.User_type === 'parent') {
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

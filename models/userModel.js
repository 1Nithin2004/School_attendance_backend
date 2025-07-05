const db = require('../config/db');

const User = {
    getAll: (callback) => {
        db.query('SELECT * FROM user', callback);
    },
    getById: (id, callback) => {
        db.query('SELECT * FROM user WHERE id = ?', [id], callback);
    },
    create: (data, callback) => {
        db.query('INSERT INTO user SET ?', data, callback);
    },
    update: (id, data, callback) => {
        db.query('UPDATE user SET ? WHERE id = ?', [data, id], callback);
    },
    delete: (id, callback) => {
        db.query('DELETE FROM user WHERE id = ?', [id], callback);
    },
    login: (email_address, password, callback) => {
        const sql = 'SELECT * FROM user WHERE email_address = ? AND password = ?';
        db.query(sql, [email_address, password], callback);
    },
    resetPassword: (email_address, newPassword, callback) => {
        db.query('UPDATE user SET Password = ? WHERE email_address = ?', [newPassword, email_address], callback);   
    },
    getClass6: (class_id, callback) => {
        const query = 'SELECT * FROM user WHERE Class = ? AND User_type = "Parent"';
        db.query(query, [class_id], callback);
    }
};

module.exports = User;

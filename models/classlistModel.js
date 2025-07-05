const db = require('../config/db');

const Class = {
    getAll: (callback) => {
        db.query('SELECT * FROM classes', callback);
    }
};

module.exports = Class;

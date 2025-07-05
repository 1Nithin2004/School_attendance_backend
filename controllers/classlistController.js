const Class = require('../models/classlistModel');

exports.getClasses = (req, res) => {
    Class.getAll((err, results) => {
        if (err) throw err;
        res.json(results);
    });
};
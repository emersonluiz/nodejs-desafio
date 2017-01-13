var mongoose = require('mongoose');

let db = null;

module.exports = app => {
    if (!db) {
        db = mongoose.connect('mongodb://localhost/desafio');
        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log("Connection DB ok!");
        });
    }
    return db;
};
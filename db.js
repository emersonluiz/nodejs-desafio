var mongoose = require('mongoose');

let db = null;

module.exports = app => {
    var url = {
        'test':'mongodb://localhost/desafio_test',
        'development':'mongodb://localhost/desafio'
    }
    if (!db) {
        db = mongoose.connect(url[process.env.NODE_ENV || 'development']);
        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            if (url[process.env.NODE_ENV] !== url.test) {
                console.log("Connection DB ok!");
            }
        });
    }
    return db;
};
const db = require('../db/connection');

exports.fetchApiTopics = () => {
    return db.query('SELECT * FROM topics')
        .then(({ rows }) => {
            return rows;
        })
};
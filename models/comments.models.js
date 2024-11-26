const db = require('../db/connection');

exports.fetchCommentsByArticleId = (article_id) => {
    const queryString = `SELECT *
                            FROM comments
                            WHERE article_id = $1
                            ORDER BY created_at DESC`;
    return db
        .query(queryString, [ article_id ])
        .then(({ rows }) => {
            if(!rows.length){
                return Promise.reject({ status: 404, msg: 'not found' });
            }
            return rows;
        });
};

exports.insertComment = (article_id, comments) => {
    const body = comments.body;
    const author = comments.username;
    const queryString = `INSERT INTO comments
                            (article_id, author, body)
                        VALUES
                            ($1, $2, $3) RETURNING *`;
    return db
        .query(queryString, [ article_id, author, body ])
        .then(({ rows }) => {
            return rows[0];
        });
}
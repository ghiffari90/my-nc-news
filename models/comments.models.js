const db = require('../db/connection');

exports.fetchCommentsByArticleId = (article_id) => {
    const queryString = `SELECT *
                            FROM comments
                            WHERE article_id = $1
                            ORDER BY created_at DESC`;
    return db
        .query(queryString, [ article_id ])
        .then(({ rows }) => {
            return rows;
        });
};

exports.checkArticleExists = (article_id) => {
    const queryString = `SELECT * 
                            FROM articles
                            WHERE article_id = $1`;
    return db
        .query(queryString, [article_id])
        .then(({ rows }) => {
            if(!rows.length){
                return Promise.reject({ status: 404, msg: 'not found' });
            }
        })
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
};

exports.deleteCommentById = (comment_id) => {
    const queryString = `DELETE FROM comments
                            WHERE comment_id = $1 RETURNING *`;
    return db
        .query(queryString, [ comment_id ])
        .then(({ rows }) => {
            if(!rows.length){
                return Promise.reject({ status: 404, msg: 'not found'});
            }
            return;
        });
};


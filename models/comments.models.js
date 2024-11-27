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
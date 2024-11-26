const db = require('../db/connection');

exports.fetchArticleById = (article_id) => {
    const queryString = 'SELECT * FROM articles WHERE article_id = $1';
    return db
        .query(queryString, [article_id])
        .then(({ rows }) => {
            if(rows.length===0){
                return Promise.reject({ status: 404, msg: 'not found' });
            }
            return rows[0];
        });
}
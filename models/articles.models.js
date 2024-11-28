const db = require('../db/connection');

exports.fetchArticles = (sort_by, order) => {
    let queryString =   `SELECT
                            articles.author,
                            articles.title,
                            articles.article_id,
                            articles.topic,
                            articles.created_at,
                            articles.votes,
                            articles.article_img_url,
                        COUNT(comments.body) AS comment_count
                        FROM articles
                        LEFT OUTER JOIN comments
                        ON articles.article_id = comments.article_id
                        GROUP BY articles.article_id
                        ORDER BY `;
    const queryValues = [];

    if(sort_by){
        queryString += `articles.${sort_by} `;
    } else {
        queryString += `articles.created_at `;
    }

    if(order){
        queryString += order;
    } else {
        queryString += 'DESC';
    }

    return db
        .query(queryString, queryValues)
        .then(({ rows }) => {
            return rows;
        });
}

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

exports.updateArticleById = (article_id, inc_votes) => {
    const newVote = inc_votes;
    const queryString = `UPDATE articles
                            SET votes = votes + $1
                            WHERE article_id = $2
                            RETURNING *`;
    return db 
        .query(queryString, [ newVote, article_id ])
        .then(({ rows }) => {
            return rows[0];
        })
};
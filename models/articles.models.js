const db = require('../db/connection');

exports.fetchArticles = () => {
    return db
        .query(`SELECT
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
                    ORDER BY articles.created_at DESC`)
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
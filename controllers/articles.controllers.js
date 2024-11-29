const { articleData } = require("../db/data/test-data");
const { fetchArticleById, fetchArticles, updateArticleById, checkTopicExists } = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
    const { sort_by } = req.query;
    const { order } = req.query;
    const { topic } = req.query;
    const promises = [ fetchArticles(sort_by, order, topic) ];

    if(topic){
        promises.push(checkTopicExists(topic));
    }
    
    return Promise.all(promises)
    .then(([ articles ]) => {
        res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateArticleById(article_id, inc_votes).then((article) => {
        res.status(200).send({ article });
    })
    .catch(next);
};
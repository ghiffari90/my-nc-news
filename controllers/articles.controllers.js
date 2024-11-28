const { articleData } = require("../db/data/test-data");
const { fetchArticleById, fetchArticles, updateArticleById } = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
    const { sort_by } = req.query;
    const { order } = req.query;
    fetchArticles(sort_by, order).then((articles) => {
        res.status(200).send({ articles });
    })
    .catch(next);
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article });
    })
    .catch(next);
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    if(Object.keys(req.body).length !== 0){
        const { inc_votes } = req.body;
        updateArticleById(article_id, inc_votes).then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
    } else {
        res.status(204).send({});
    }
};
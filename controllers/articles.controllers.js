const { articleData } = require("../db/data/test-data");
const { fetchArticleById, fetchArticles, updateArticleById } = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles });
    })
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
            console.log(article, "<<< response from SQL")
            res.status(200).send({ article });
        })
        .catch(next);
    } else {
        res.status(204).send({});
    }
};
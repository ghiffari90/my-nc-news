const { fetchCommentsByArticleId, checkArticleExists, insertComment, deleteCommentById } = require("../models/comments.models");


exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const promises = [ fetchCommentsByArticleId(article_id), checkArticleExists(article_id)];

    Promise.all(promises)
    .then(([ comments ]) => {
        res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;
    insertComment(article_id, newComment).then((postedComment) => {
        res.status(201).send({ postedComment: postedComment })
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    deleteCommentById(comment_id).then((deletedComment) => {
        res.sendStatus(204);
    })
    .catch(next);
};
const { fetchApiTopics } = require("../models/topics.models");

exports.getApiTopics = (req, res, next) => {
    fetchApiTopics().then((result) => {
        res.status(200).send({ topics: result });
    })
};
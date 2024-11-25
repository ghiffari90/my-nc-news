const { fetchApiTopics } = require("../models/topics.models");

exports.getApiTopics = (req, res, next) => {
    fetchApiTopics().then((topics) => {
        res.status(200).send({ topics });
    })
};
const express = require('express');
const app = express();
const { getApi } = require('./controllers/api.controllers');
const { getApiTopics } = require('./controllers/topics.controllers');

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getApiTopics);

app.use((err, req, res, next) => {
    console.log(req, "<<<< req received by app");
    console.log(res, "<<< response sent by app");
    console.log(err, "<<<< err from app");
});

module.exports = app;
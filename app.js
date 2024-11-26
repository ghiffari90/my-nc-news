const express = require('express');
const app = express();
const { getApi } = require('./controllers/api.controllers');
const { getApiTopics } = require('./controllers/topics.controllers');
const { getArticleById, getArticles } = require('./controllers/articles.controllers');
const { psqlErrorHandler, customErrorHandler, serverErrorHandler } = require('./error-handlers');

app.get('/api', getApi);

app.get('/api/topics', getApiTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
const express = require("express");
const app = express();
const cors = require("cors");
const { getApi } = require("./controllers/api.controllers");
const { getApiTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("./controllers/articles.controllers");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./error-handlers");
const {
  getCommentsByArticleId,
  postComment,
  removeCommentById,
} = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");

app.use(cors());
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getApiTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", removeCommentById);

app.get("/api/users", getUsers);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;

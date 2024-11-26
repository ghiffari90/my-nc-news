const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const { articleData, commentData, topicData, userData } = require('../db/data/test-data');

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });


});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).not.toBe(0);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String)
          });
        }); 
      });
  });
});

describe("GET non-existend URL", () => {
  test("404: Responds with a message of 'Bad Request' when the URL is not found", () => {
    return request(app)
      .get("/ap")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).not.toBe(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
            article_img_url: expect.any(String)
          });
        });
        expect(articles).toBeSortedBy('created_at', { descending: true });
      });
  });
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object with the article_id from the URL", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article }  }) => {
        expect(article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: new Date(1604394720000).toISOString(),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      })
  });

  test("400: Responds with a message 'Invalid id type' if the article_id in the URL is invalid", () => {
    return request(app)
      .get('/api/articles/one')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Invalid id type')
      });
  });

  test("404: Responds with a message 'not found' if the article_id in the URL is non-existent", () => {
    return request(app)
      .get('/api/articles/100')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('not found');
      });
  });
});

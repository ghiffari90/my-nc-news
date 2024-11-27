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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an article object with the article_id from the URL", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments }  }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).not.toBe(0);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number)
          });
        });
        expect(comments).toBeSortedBy('created_at', { descending: true });
      })
  });

  test("400: Responds with a message 'Invalid id type' if the article_id in the URL is invalid", () => {
    return request(app)
      .get('/api/articles/one/comments')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Invalid id type')
      });
  });

  test("404: Responds with a message 'not found' if the article_id in the URL is non-existent", () => {
    return request(app)
      .get('/api/articles/100/comments')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('not found');
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment when a comment is posted for a specific article identified by the given article_id", () => {
    const expectedComment = 'Great article! Definitely worth to read.';
    return request(app)
      .post('/api/articles/7/comments')
      .send({
        username: 'lurker',
        body: 'Great article! Definitely worth to read.'
      })
      .expect(201)
      .then(({ body: { postedComment }}) => {
        expect(postedComment).toMatchObject({
          article_id: 7,
          author: 'lurker',
          body: 'Great article! Definitely worth to read.',
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number)
        });
      });
  });

  test("400: Responds with a message 'Invalid id type' if the article_id in the URL is invalid", () => {
    const expectedComment = 'Great article! Definitely worth to read.';
    return request(app)
      .post('/api/articles/seven/comments')
      .send({
        username: 'lurker',
        body: 'Great article! Definitely worth to read.'
      })
      .expect(400)
      .then(({ body: { msg }}) => {
        expect(msg).toBe('Invalid id type');
      })
  });

  test("422: Responds with a message 'invalid content' if there is no body property", () => {
    return request(app)
      .post('/api/articles/7/comments')
      .send({
        username: 'lurker',
      })
      .expect(422)
      .then(({ body: { msg }}) => {
        expect(msg).toBe('invalid content');
      })
  });

  test("422: Responds with a message 'invalid content' if there is no username property", () => {
    return request(app)
      .post('/api/articles/7/comments')
      .send({
        body: 'Great article! Definitely worth to read.'
      })
      .expect(422)
      .then(({ body: { msg }}) => {
        expect(msg).toBe('invalid content');
      })
  });

  test("404: Responds with a message 'not found' if the article_id in the URL is non-existent", () => {
    const expectedComment = 'Great article! Definitely worth to read.';
    return request(app)
      .post('/api/articles/100/comments')
      .send({
        username: 'lurker',
        body: 'Great article! Definitely worth to read.'
      })
      .expect(404)
      .then(({ body: { msg }}) => {
        expect(msg).toBe('not found');
      })
  });

  test("404: Responds with a message 'not found' if the username doesn't exist", () => {
    return request(app)
      .post('/api/articles/4/comments')
      .send({
        username: 'ghiffari',
        body: 'Great article! Definitely worth to read.'
      })
      .expect(404)
      .then(({ body: { msg }}) => {
        expect(msg).toBe('not found');
      })
  });
});
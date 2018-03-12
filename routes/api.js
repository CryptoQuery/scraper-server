var express = require('express');
var router = express.Router();

var lib = require('../lib/index.js');

// NOTE: () = authentication, <> = body parameter

//DONE: middleware <content>
var middleware = function(req, res, next) {
  lib.auth.decrypt(req.body).then(function (result) {
    req.auth = result;
    next();
  }).catch(function (error) {
    res.status(400).json({
      success: false,
      response: 'auth failed'
    });
  });
};


//DONE: addArticle (content) <link> <image> <published_at> <author> <title> <description> <article>
router.post('/addArticle', middleware, function (req, res, next) {
  lib.articles.addArticle(req.auth).then(function (result) {
    res.json({
      success: true,
      response: result
    });
  }).catch(function (error) {
    res.status(400).json({
      success: false,
      response: 'request failed'
    });
  });
});

//CHECK: updateArticle (content) <article_id> <link> <image> <processed> <published_at> <author> <title> <description> <article>
router.post('/updateArticle', middleware, function (req, res, next) {
  lib.articles.updateArticle(req.auth).then(function (result) {
    res.json({
      success: true,
      response: result
    });
  }).catch(function (error) {
    res.status(400).json({
      success: false,
      response: 'request failed'
    });
  });
});

//DONE: getArticles <[article_id]>
router.post('/getArticles', function (req, res, next) {
  lib.articles.getArticles(req.body).then(function (result) {
    res.json({
      success: true,
      response: result
    });
  }).catch(function (error) {
    res.status(400).json({
      success: false,
      response: 'request failed'
    });
  });
});

//DONE: getArticlesByUrl <[url]>
router.post('/getArticlesByUrl', function (req, res, next) {
  lib.articles.getArticlesByUrl(req.body).then(function (result) {
    res.json({
      success: true,
      response: result
    });
  }).catch(function (error) {
    res.status(400).json({
      success: false,
      response: 'request failed'
    });
  });
});

//DONE: getArticlesByDate <start_date> <end_date>
router.post('/getArticlesByDate', function (req, res, next) {
  lib.articles.getArticlesByDate(req.body).then(function (result) {
    res.json({
      success: true,
      response: result
    });
  }).catch(function (error) {
    res.status(400).json({
      success: false,
      response: 'request failed'
    });
  });
});

//DONE: getArticlesByProcessed <processed>
router.post('/getArticlesByProcessed', function(req, res, next) {
  lib.articles.getArticlesByProcessed(req.body).then(function (result) {
    res.json({
      success: true,
      response: result
    });
  }).catch(function (error) {
    res.status(400).json({
      success: false,
      response: 'request failed'
    });
  });
});

module.exports = router;
var express = require('express');
var router = express.Router();

var lib = require('../lib/index.js');

var middleware = function(req, res, next) {
  lib.auth.decrypt(req.body).then(function (result) {
    req.auth = result;
    next();
  }).catch(function (error) {
    res.status(400).json({
      success: false,
      response: 'auth failed'
    });
  })
};


//DONE: addArticle <link> <published_at> <author> <title> <article>
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

module.exports = router;
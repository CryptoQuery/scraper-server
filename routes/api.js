var express = require('express');
var router = express.Router();

var lib = require('../lib/index.js');


//DONE: addArticle <link> <published_at> <author> <title> <article>
router.post('/addArticle', function (req, res, next) {
  lib.auth.decrypt(req.body).then(function (result) {
    return lib.articles.addArticle(result);
  }).then(function (result) {
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

//DONE: getArticle <[url]>
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

//CHECK: getArticlesByDate <start_date> <end_date>
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
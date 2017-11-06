var express = require('express');
var router = express.Router();

var lib = require('../lib/index.js');


// addArticle <link> <published_at> <author> <title> <article>
router.post('/addArticle', function (req, res, next) {
  lib.articles.addArticle(req.body).then(function (result) {
    res.json({
      success: true,
      response: result
    });
  }).catch(function (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      response: 'request failed'
    });
  });
});

// findArticle <search> <limit> <offset>
router.post('/findArticles', function (req, res, next) {
  lib.articles.findArticles(req.body).then(function (result) {
    res.json({
      success: true,
      response: result
    });
  }).catch(function (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      response: 'request failed'
    });
  });
});

module.exports = router;
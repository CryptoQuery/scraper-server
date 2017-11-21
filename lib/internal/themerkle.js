var axios = require('axios');
var q = require('q');
var _ = require('lodash');
var cheerio = require('cheerio');
var shortid = require('shortid');

var Article = require('../models/article.js');

var themerkle = {};

//DONE: getArticlePages <pages> <url>
themerkle.getArticlePages = function(query) {
  return _.range(1,query.pages + 1).reduce(function (chain, current) {
    return chain.then(function (previous) {
      return q.delay(500).then(function () {
        return axios.post(query.url + '/page/' + current).then(function (result) {
          var $ = cheerio.load(result.data);
          var articleUrls =[];
          $('div[id="content_box"]').find('article > a').each(function(index, element) {
            articleUrls.push($(element).attr('href'));
          });
          return previous.concat(articleUrls);
        });
      });
    });
  }, q([]));
};

//DONE: getArticlePage <url>
themerkle.getArticlePage = function(query) {
  return axios.get(query.url).then(function(result) {
    var $ = cheerio.load(result.data);
    var article = [];
    var title = _.trim($('header > h1[itemprop="name headline"]').first().text());
    var infoElement = $('div[class="post-info"]');
    var author = $(infoElement).find('span[itemprop="author"]').first().text();
    var published = $(infoElement).find('span[itemprop="datePublished dateModified"] > span').first().text();
    $('div[class="thecontent"]').find('p').each(function(index, element) {
      article.push(_.trim($(element).first().text()));
    });
    return {
      title: title,
      author: author,
      published: published,
      body: _.join(article, ' ')
    };
  });
};

//CHECK: addArticle <link> <published_at> <author> <title> <article>
themerkle.addArticle = function(query) {
  return q.fcall(function() {
    return new Article({
      _id: shortid.generate(),
      link: query.link,
      title: query.title,
      article: query.article,
      published_at: query.published_at,
      author: query.author
    }).save();
  }).then(function (result) {
    return {
      article_id: result._id
    };
  })
};

//CHECK: getArticlesByUrl <[url]>
themerkle.getArticlesByUrl = function(query) {
  return q.fcall(function() {
    return Article.find({
      link: {
        $in: query.url
      }
    })
    .exec();
  }).then(function (data) {
    return data.map(function (article) {
      return {
        article_id: article._id,
        created_at: article.created_at,
        published_at: article.published_at,
        author: article.author,
        link: article.link,
        title: article.title,
        article: article.article
      };
    });
  })
};

module.exports = themerkle;
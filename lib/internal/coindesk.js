var axios = require('axios');
var q = require('q');
var _ = require('lodash');
var cheerio = require('cheerio');
var shortid = require('shortid');

var Article = require('../models/article.js');

var coindesk = {};

//DONE: getArticlePages <url> <page>
coindesk.getArticlePages = function(query) {
  return axios.post(query.url + '/page/' + query.page).then(function (result) {
    var $ = cheerio.load(result.data);
    var articleUrls =[];
    $('div[id="content"]').find('div > div[class="post-info"] > h3 > a').each(function(index, element) {
      articleUrls.push($(element).attr('href'));
    });
    return articleUrls;
  });
};

//DONE: getArticlePage <url>
coindesk.getArticlePage = function(query) {
  return axios.get(query.url).then(function(result) {
    var $ = cheerio.load(result.data);
    var article = [];
    var title = _.trim($('h3[class="article-top-title"]').first().text());
    var authorElement = $('p[class="timeauthor"]').first();
    var author = $(authorElement).find('a').first().text();
    var published = $(authorElement).find('time').first().attr('datetime');
    $('div[class="article-content-container noskimwords"]').find('p').each(function(index, element) {
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
coindesk.addArticle = function(query) {
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
coindesk.getArticlesByUrl = function(query) {
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

module.exports = coindesk;
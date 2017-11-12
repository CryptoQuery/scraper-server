
var q = require('q');
var axios = require('axios');
var _ = require('lodash');
var cheerio = require('cheerio');
var shortid = require('shortid');
var j = require('joi');

var Article = require('../models/article.js');

var coindesk = {};

//CHECK: getArticlePages <url> <page>
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

//CHECK: getArticle <url>
coindesk.getArticle = function(query) {
  return axios.get(query.url).then(function(result) {
    var $ = cheerio.load(result.data);
    var article = [];
    var title = _.trim($('h3[class="featured-article-title"]').first().text());
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
    //FILTER
    j.assert(query, {
      link: j.string().required(),
      published_at: j.date().allow(''),
      author: j.string().allow(''),
      title: j.string().max(100).required(),
      article: j.string().max(50000).required()
    });
    return {
      link: query.link,
      title: query.title,
      article: query.article,
      published_at: query.published_at,
      author: query.author
    }
  }).then(function (result) {
    // Add article to mongo database
    return new Article({
      _id: shortid.generate(),
      link: result.link,
      title: result.title,
      article: result.article,
      published_at: result.published_at,
      author: result.author
    }).save();
  }).then(function (result) {
    return {
      article_id: result._id
    };
  });
};


module.exports = coindesk;
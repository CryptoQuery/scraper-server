
var q = require('q');
var axios = require('axios');
var _ = require('lodash');
var cheerio = require('cheerio');
var shortid = require('shortid');
var j = require('joi');

var Article = require('../models/article.js');

var cointelegraph = {};


// This function may not be used because they are just advertisements
//CHECK: pressPages <url> <category_id> <page>
cointelegraph.pressPages = function(query) {
  return axios.post(query.url, {
    category_id: query.category_id,
    page: query.page,
    lang: 'en',
    region_id: '1'
  }).then(function (result) {
    if(result.data.posts) {
      return q.all(result.data.posts.map(function (result) {
        return {
          title: result.title,
          url: result.url,
          published: result.published
        };
      }));
    }
    else {
      return [];
    }
  });
};

//CHECK: articlePages <url> <tag> <page>
cointelegraph.articlePages = function(query) {
  return axios.post(query.url, {
    tag: query.tag,
    page: query.page
  }).then(function (result) {
    if(result.data.posts) {
      return q.all(result.data.posts.map(function (result) {
        return {
          url: result.url,
          published: result.published,
          author: result.author
        };
      }));
    }
    else {
      return [];
    }
  });
};

//CHECK: article <url>
cointelegraph.article = function(query) {
  return axios.get(query.url).then(function(result) {
    var $ = cheerio.load(result.data);
    var article = [];
    // Check if: "This is a paid press release."
    var title = _.trim($('h1[itemprop="headline"]').first().text());
    $('div[class="post-content"]').find('div[itemprop="articleBody"] > p').each(function(index, element) {
      article.push(_.trim($(element).first().text()));
    });
    return {
      title: title,
      body: _.join(article, ' ')
    };
  });
};

//CHECK: addArticle <link> <published_at> <author> <title> <article>
cointelegraph.addArticle = function(query) {
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

module.exports = cointelegraph;
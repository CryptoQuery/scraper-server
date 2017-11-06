
var q = require('q');
var j = require('joi');
var shortid = require('shortid');

var Articles = require('../models/articles.js');

var articles = {};

// addArticle <link> <published_at> <author> <title> <article>
articles.addArticle = function(query) {
  return q.fcall(function() {
    //FILTER
    j.assert(query, j.object().keys({
      link: j.string().required(),
      published_at: j.date().allow(''),
      author: j.string().allow(''),
      title: j.string().max(100).required(),
      article: j.string().max(10000).required()
    }).required());
    return {
      link: query.link,
      title: query.title,
      article: query.article,
      published_at: query.published_at,
      author: query.author
    }
  }).then(function (result) {
    // Add article to mongo database
    return new Articles({
      _id: shortid.generate(),
      link: result.link,
      title: result.title,
      article: result.article,
      published_at: result.published_at,
      author: result.author
    }).save();
  });
};

// findArticle <search> <limit> <offset>
articles.findArticles = function(query) {
  return q.fcall(function() {
    //FILTER
    j.assert(query, {
      search: j.string().allow('').required(),
      sort: j.string().valid(['published_at', 'created_at', 'updated_at']).required(),
      limit: j.number().required(),
      offset: j.number().required()
    });

    return {
      search: query.search,
      sort: query.title,
      limit: query.limit,
      offset: query.offset
    }
  }).then(function (data) {
    // Search articles and sort by relevance
    return Articles.find({ $text: { $search: data.search } }, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .skip(data.offset)
    .limit(query.limit)
    .exec();
  }).then(function (data) {
    return data;
  });
};

module.exports = articles;
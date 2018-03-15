
var q = require('q');
var j = require('joi');
var shortid = require('shortid');

var Article = require('../models/article.js');

var articles = {};

//DONE: addArticle <link> <image> <published_at> <author> <title> <description> <article>
articles.addArticle = function(query) {
  return q.fcall(function() {
    j.assert(query, {
      link: j.string().required(),
      image: j.string().allow(''),
      published_at: j.date().allow(''),
      author: j.string().allow(''),
      title: j.string().max(100).required(),
      description: j.string().max(1000).required(),
      article: j.string().max(50000).required()
    });
    return {
      link: query.link,
      image: query.image,
      title: query.title,
      description: query.description,
      article: query.article,
      published_at: query.published_at,
      author: query.author
    }
  }).then(function (result) {
    // Add article to mongo database
    return new Article({
      _id: shortid.generate(),
      link: result.link,
      image: result.image,
      title: result.title,
      description: result.description,
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

//CHECK: updateArticle <article_id> <link> <image> <processed> <published_at> <author> <title> <description> <article>
articles.updateArticle = function(query) {
  return q.fcall(function() {
    j.assert(query, {
      article_id: j.string().required(),
      link: j.string().required(),
      image: j.string().allow(''),
      processed: j.boolean().required(),
      published_at: j.date().allow(''),
      author: j.string().allow(''),
      title: j.string().max(100).required(),
      description: j.string().max(1000).required(),
      article: j.string().max(50000).required()
    });
    return {
      article_id: query.article_id,
      link: query.link,
      image: query.image,
      processed: query.processed,
      title: query.title,
      description: query.description,
      article: query.article,
      published_at: query.published_at,
      author: query.author
    }
  }).then(function (result) {
    // Add article to mongo database
    return Article.update({
      _id: result.article_id
    },{
      link: result.link,
      image: result.image,
      processed: result.processed,
      title: result.title,
      description: result.description,
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

//DONE: getArticles <[article_id]>
articles.getArticles = function(query) {
  return q.fcall(function() {
    j.assert(query, {
      article_id: j.array().items(j.string().required()).required()
    });

    return {
      article_id: query.article_id
    };
  }).then(function (data) {
    // Search articles and sort by relevance
    return Article.find({
      _id: {
        $in: data.article_id
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
        image: article.image,
        processed: article.processed,
        title: article.title,
        description: article.description,
        article: article.article
      };
    });
  })
};

//DONE: getArticlesByUrl <[url]>
articles.getArticlesByUrl = function(query) {
  return q.fcall(function() {
    j.assert(query, {
      url: j.array().items(j.string().required()).required()
    });

    return {
      url: query.url
    };
  }).then(function (data) {
    // Search articles and sort by relevance
    return Article.find({
      link: {
        $in: data.url
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
        image: article.image,
        processed: article.processed,
        title: article.title,
        description: article.description,
        article: article.article
      };
    });
  });
};

//DONE: getArticlesByDate <start_date> <end_date> <limit> <offset>
articles.getArticlesByDate = function(query) {
  return q.fcall(function() {
    j.assert(query, {
      start_date: j.date().required(),
      end_date: j.date().required(),
      limit: j.number().integer().required(),
      offset: j.number().integer().required()
    });

    return {
      start_date: query.start_date,
      end_date: query.end_date,
      limit: query.limit,
      offset: query.offset
    }
  }).then(function (data) {
    // Search articles and sort by relevance
    return Article.find({
      published_at: {
        $gte: new Date(data.start_date).toISOString(),
        $lt: new Date(data.end_date).toISOString()
      }
    })
    .limit(data.limit)
    .skip(data.offset)
    .exec();
  }).then(function (data) {
    return data.map(function (article) {
      return {
        article_id: article._id,
        created_at: article.created_at,
        published_at: article.published_at,
        author: article.author,
        link: article.link,
        image: article.image,
        processed: article.processed,
        title: article.title,
        description: article.description,
        article: article.article
      };
    });
  });
};

//DONE: getArticlesByProcessed <processed> <limit> <offset>
articles.getArticlesByProcessed = function(query) {
  return q.fcall(function() {
    j.assert(query, {
      processed: j.boolean().required(),
      limit: j.number().integer().required(),
      offset: j.number().integer().required()
    });

    return {
      processed: query.processed,
      limit: query.limit,
      offset: query.offset
    };
  }).then(function (data) {
    // Search articles and sort by relevance
    return Article.find({
      processed: {
        $eq: data.processed
      }
    })
    .limit(data.limit)
    .skip(data.offset)
    .exec();
  }).then(function (data) {
    return data.map(function (article) {
      return {
        article_id: article._id,
        created_at: article.created_at,
        published_at: article.published_at,
        author: article.author,
        link: article.link,
        processed: article.processed,
        image: article.image,
        title: article.title,
        description: article.description,
        article: article.article
      };
    });
  })
};

module.exports = articles;
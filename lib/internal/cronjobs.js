
var _ = require('lodash');
var q = require('q');
var cron = require('cron').CronJob;

var coindesk = require('./coindesk.js');


var config = {
  coindesk: {
    categories: [
      'https://www.coindesk.com/category/technology-news',
      'https://www.coindesk.com/category/markets-news',
      'https://www.coindesk.com/category/business-news'
    ]
  },
  cointelegraph: {
    postUrl: 'https://cointelegraph.com/api/v1/ajax/categories/next',
    press: [
      {
        url: 'https://cointelegraph.com/press-releases',
        category_id: 58
      }
    ],
    tags: [
      'bitcoin',
      'ethereum',
      'altcoin',
      'blockchain',
      'bitcoin-regulation',
      'bitcoin-scams'
    ]
  }
};

//CHECK: Get coindesk.com Articles (30 mins)
new cron('0 */10 * * * *', function() {
  q.fcall(function() {
    // Get articles form Coin Desk
    return _.range(1,3).reduce(function (chain, current) {
      return chain.then(function (previous) {
        return coindesk.getArticlePages({
          url: config.coindesk.categories[0],
          page: current
        }).then(function (links) {
          // Check if articles exist
          return coindesk.getArticlesByUrl({
            url: links
          }).then(function (result) {
            // Get article information
            return _.difference(links, _.map(result, 'link')).reduce(function (chain, current) {
              return chain.then(function (previous) {
                return q.delay(500).then(function () {
                  return coindesk.getArticlePage({
                    url: current
                  }).then(function (article) {
                    return coindesk.addArticle({
                      link: current,
                      author: article.author,
                      published_at: isNaN(Date.parse(article.published)) ? new Date().toISOString() : article.published,
                      title: article.title,
                      article: article.body
                    }).then(function() {
                      console.log("Added Article: " + article.title);
                    });
                  });
                });
              });
            }, q([]));
          });
        });
      });
    }, q([])).catch(function (error) {
      console.error(error);
    });
  });
}, null, true, 'America/Los_Angeles');
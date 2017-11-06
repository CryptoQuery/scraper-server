
var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
  _id: {type: String, unique: true, require: true},
  created_at: Date,
  updated_at: Date,
  published_at: Date,
  author: String,
  link: {type: String, require: true},
  title: {type: String, require: true},
  article: {type: String, require: true}
});
articleSchema.index({
  author: 'text',
  title: 'text',
  article: 'text'
});

articleSchema.pre('save', function(next) {
  var currentDate = new Date();
  if(!this.created_at) this.created_at = currentDate;
  this.updated_at = currentDate;
  next();
});

module.exports = mongoose.model('Article', articleSchema);
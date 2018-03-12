
var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
  _id: {type: String, unique: true, require: true},
  processed: {type: Boolean, default: false},
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()},
  published_at: {type: Date, default: Date.now()},
  author: {type: String},
  link: {type: String, require: true},
  image: {type: String},
  title: {type: String, require: true},
  description: {type: String, require: true},
  article: {type: String, require: true}
});

articleSchema.index({
  author: 'text',
  title: 'text',
  description: 'text',
  article: 'text'
});

articleSchema.pre('save', function(next) {
  var currentDate = new Date();
  if(!this.created_at) this.created_at = currentDate;
  this.updated_at = currentDate;
  next();
});

module.exports = mongoose.model('Article', articleSchema);
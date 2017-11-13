
var config = {};

config.secret_key = '';

if(process.env.NODE_ENV === 'production'){
  //production
  config.DB = process.env.DATABASE_URL;

}else{
  //development
  config.DB = 'mongodb://IP:PORT';
}

module.exports = config;
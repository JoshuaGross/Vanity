// Config
var resume_path = '/resources/resume.pdf';
var vanity_version_int = 1;

// Module dependencies.
var async = require('async');
var express = require('express');
var fs = require('fs');
var redis_lib = require("redis");
var app = module.exports = express.createServer();
var port;

// Redis
var redis = redis_lib.createClient();
redis.on("error", function (err) {
  console.log("Redis connection error to " + redis.host + ":" + redis.port + " - " + err);
  process.exit(1);
});

// Express App Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  port = 3000;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('dotcloud', function(){
  port = 8080;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('heroku', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  port = 80;
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  redis.mget('a:title', 'a:tagline', 'a:contact', function (err, replies) {
    var title = replies[0];
    var tagline = replies[1];
    var contact = JSON.parse(replies[2]);

    res.render('index', {
      html_head_ifs: '<!--[if lt IE 7]><html class="ie ie6" lang="en"><[endif]--><!--[if IE 7 ]><html class="ie ie7" lang="en"> <![endif]--><!--[if IE 8 ]><html class="ie ie8" lang="en"> <![endif]--><!--[if (gte IE 9)|!(IE)]><!--><html lang="en"> <!--<![endif]-->',
      title: title,
      tagline: tagline,
      resume_path: resume_path,
      contact: {
        email: contact.email,
        facebook: contact.facebook,
        twitter: contact.twitter,
        gplus: contact.gplus
      }
    });
  });
});

// Todo:
// - about text
// - resume
// - pull in photos from Gravatar, Facebook, Twitter, G+
// - passions, blog, RSS
// - Post to Twitter, Facebook, G+ with nice URLs
//   - post fulltext if update is short enough
//   - pull location from FB, Yelp, Twitter, G+
// - Pull in read (marked?) articles from Google Reader
// - favicon

port = process.env.PORT || port;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// Help Vanity site owner with some setup
var resume_exists = false;
try {
  resume_exists = fs.lstatSync('public'+resume_path).isFile();
} catch (e) {
  console.log(e);
}
if (!resume_exists) {
  console.log('WARNING: no resume file found. Place it at /public'+resume_path);
}

require('./redis_migrations.js')(redis, vanity_version_int);

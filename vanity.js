
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'josh is gross',
    tagline: 'home of Joshua Gross',
    contact: {
      email: 'joshua.gross@gmail.com',
      facebook: 'http://www.facebook.com/joshisgross',
      twitter: 'joshuagross',
      gplus: 'gplusid',
    }
  });
});

// Todo:
// - about text
// - pull in photos from Gravatar, Facebook, Twitter, G+
// - passions, blog, RSS
// - Post to Twitter, Facebook, G+ with nice URLs
//   - post fulltext if update is short enough
//   - pull location from FB, Yelp, Twitter, G+
// - Pull in read (marked?) articles from Google Reader
// - favicon
// - pretty, clean layout

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

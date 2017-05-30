var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var fs = require('fs');

require('./routes/config');

var index = require('./routes/index');
var users = require('./routes/users');
var render = require('./routes/render');

var controller = require('./routes/controller');

var app = express();

app.use(session({
    cookieName : 'session',
    secret : ' ',
    duration : 1000 * 60 * 60 * 24 * 30,
    activeDuration : 1000 * 60 * 24 * 30
}));


setInterval(function(){
    console.log("Redis Flushed");
    controller.redisCron();
}, 60*60*1000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'logo.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/logo', function(request, response){
    fs.readFile('public/images/logo.png', function(err, data){
        console.log(err);
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.end(data);
    });

});

app.get('/', render.index);
app.get('/about', render.about);
app.post('/search', controller.search);
app.use('/users', users);
app.get('/search/:searchString/:category/:pageNo', controller.newSearch);
app.get('/getData/:category/:pageNo', controller.getData);
app.get('/setSession/:theme', controller.setSession);
app.get('/worldnews.php', render.index);
app.get('/article/*/*', render.article);
app.get('/getArticle/:category/:articleId', controller.getArticle);
app.post('/saved', controller.saved);
app.get('/:category', render.index);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

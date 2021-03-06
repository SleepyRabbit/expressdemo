var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var ejs = require('ejs');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var photo = require('./routes/photo');
var upload = require('./routes/upload');

var redis_options = {
    host: "127.0.0.1",
    port: "6379",
    // db: "jone_snow",
    ttl: 60 * 60 * 24 * 30,
}

var app = express();

app.use(session({
    store: new redisStore(redis_options),
    secret: 'Winter is coming!',
    resave: false,
    saveUninitialized: false
}));

app.use(function (req, res, next) {
    console.log(req.session.user);
    if (!req.session) {
        console.log("no session appear!");
        return;
        // return next() // handle error
    }
    next() // otherwise continue
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('html', ejs.__express);
// app.set('view engine', 'html');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'upload')));

app.use('/', index);
app.use('/users', users);
app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/register', register);
app.use('/api/photo', photo);
app.use('/api/upload', upload);

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

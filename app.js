var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport=require('passport');
var util=require('util');
var WeiboStrategy = require('passport-weibo').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


var WEIBO_CLIENT_ID = "18205253820";
var WEIBO_CLIENT_SECRET = "wj1314520";

//var WEIBO_CLIENT_ID = "--insert-weibo-client-id-here--";
//var WEIBO_CLIENT_SECRET = "--insert-weibo-client-secret-here--";

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


passport.use(new WeiboStrategy({
        clientID: WEIBO_CLIENT_ID,
        clientSecret: WEIBO_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/weibo/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Weibo profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Weibo account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.get('/', function(req, res){
    res.render('index', { user: req.user });
});

//app.get('/account', ensureAuthenticated, function(req, res){
//    res.render('account', { user: req.user });
//});

app.get('/login', function(req, res){
    res.render('login', { user: req.user });
});

app.get('/auth/weibo',
    passport.authenticate('weibo'),
    function(req, res){

        console.log(req);
        // The request will be redirected to Weibo for authentication, so this
        // function will not be called.
    });

app.get('/auth/weibo/callback',
    passport.authenticate('weibo', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

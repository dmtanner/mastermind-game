var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session: expressSession});
var mongoose = require('mongoose');
require('./models/users_model.js');
require('./models/highscore_model.js');

var routes = require('./routes/index');
var users = require('./routes/users');

//var mastermind_router = require("./routes/mastermind");
//var mastermind_controller = require("./controllers/mastermind");

//var mastermindDB = mongoose.createConnection('mongodb://localhost/mastermind');
var conn = mongoose.connect('mongodb://localhost/mastermind');  //mastermind?

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//console.log("Mongoose db name: " + mongoose.connection.getName());
app.use(expressSession({
        secret: 'MoonyMax',
        cookie: {maxAge: 60*60*1000},
        store: new mongoStore({
                db: 'mastermind',
                collection: 'sessions'
        }),
        resave: false,
        saveUninitialized: false
}));

app.use('/', routes);
//app.use('/mastermind', mastermind_router);
app.use('/users', users);

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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//app.disable('etag');
//app.listen(80);
module.exports = app;

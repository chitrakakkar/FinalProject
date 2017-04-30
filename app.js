var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('express-flash');

var index = require('./routes/index');
var assert = require('assert');
var users = require('./routes/users');



//var mongo_pw = process.env.Mongo_PW;
var url = 'mongodb://localhost:27017/Tasks';
mongoose.connect(url);


var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/users', users);
// add app.use() call to add the db to each request

    app.use('/', index);
// catch 404 and forward to error handler
    app.use(function (req, res, next)
    {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
// error handler
    app.use(function (err, req, res, next)
    {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');

});
module.exports = app;
// exposing the router variable globally to be used into different files.

//about procfile:- Procfile is a mechanism for declaring what commands are run by your application's dynos on the Heroku platform.
// Procfile to tell Heroku how to run various pieces of your app.
// Package.JSon is used to give information to npm that allows it to identify the project as
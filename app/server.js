/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    entity = require('./routes/entity'),
    annotation = require('./routes/annotation'),
    http = require('http'),
    mysql = require('mysql'),
    pool = require('./config/mysql.js'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var app = express();


function findById(id, fn) {
    pool.query('SELECT * FROM admins WHERE id = ?', [id]).then(function(res) {
        if (res) {

            fn(null, res[0]);
        } else {

            fn(new Error('User ' + id + ' does not exist'));
        }
    }).fail(function() {
        fn(new Error('User ' + id + ' does not exist'));
    });

}

function findByUsername(username, fn) {



    pool.query('SELECT * FROM admins WHERE username =?', [username]).then(function(res) {
        if (res) {
            console.log('user found');
            fn(null, res[0]);
        } else {
            console.log('user not found');
            fn(null, null);
        }
    }).fail(function() {
        console.log('user not found');
        fn(null, null);
    });

}

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(

function(username, password, done) {
    console.log(username);
    console.log(password);

    // asynchronous verification, for effect...
    process.nextTick(function() {
        // Find the user by username.  If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        findByUsername(username, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user ' + username
                });
            }

            console.log(user.username, password);

            pool.query('SELECT COUNT(*) as count FROM admins WHERE username =? AND password=MD5(?)', [user.username, password]).then(function(res) {
                console.log(res);
                console.log(res.count);
                if (res && res[0].count > 0) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });
        });
    });
}));

/**
 * App configuration
 */
app.configure(function() {
    'use strict';
    // app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.session({
        secret: 'keyboard cat',
        maxAge: null,
        cookie: {
            httpOnly: false
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);

});

app.configure('development', function() {
    app.use(express.errorHandler());
});


app.post('/login', function(req, res, next) {
    console.log(req.body['username'] + ' ou');
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            return res.send(JSON.stringify({
                access: 'denied'
            }));
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.send(JSON.stringify(user));
        });
    })(req, res, next);
});



app.get('/users', ensureAuthenticated, user.list);
app.get('/entities', ensureAuthenticated, entity.list);
app.get('/annotations', ensureAuthenticated, annotation.list);
app.get('/userAuth', ensureAuthenticated, function(req, res) {
    res.send(JSON.stringify(req.user));
});

app.get('/autocomplete', ensureAuthenticated, function(req, res){
    var table = req.query.table;
    var column = req.query.column;
    var queryStr ='SELECT DISTINCT ' + req.query.column + ' FROM ' + req.query.table;
    var query = pool.query('SELECT DISTINCT ' + req.query.column + ' FROM ' + req.query.table);
    console.log(queryStr);
    query.then(function(result) {
        res.json(result);
    }).fail(function() {
        res.json({
            success: 'no'
        });
    });
});

app.get('/filters', ensureAuthenticated, function(req, res) {
    console.log(req.user.id, req.query.entity)
    var query = pool.query('SELECT id,filter FROM filters WHERE idUser=? AND entity=?', [req.user.id, req.query.entity]);

    query.then(function(result) {
        res.json(result);
    }).fail(function() {
        res.json({
            success: 'no'
        });
    });
});

app.post('/filters', ensureAuthenticated, function(req, res) {

    var queryStr = "REPLACE into filters(id, idUser,entity, filter) values(" + req.body.idFilter + " , " + req.user.id + ",'" + req.body.entity + "','" + req.body.filter + "')";


    // var query = pool.query("INSERT into filters(id,idUser, filter) values(?, ?, '?')",
    // req.body.idFilter, req.user.id, "'" + req.body.filter + "'");

    var query = pool.query(queryStr);
    console.log(queryStr);

    var myFilter = req.body.filter;
    console.log(req.body.idFilter, req.user.id, myFilter);
    query.then(function(data) {
        res.json({
            success: 'ok'
        });
    }).fail(function(err) {
        res.json(err);
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send(JSON.stringify({
        access: 'denied'
    }));
}

var server = http.createServer(app);
exports = module.exports = server;

exports.use = function() {
    app.use.apply(app, arguments);
};
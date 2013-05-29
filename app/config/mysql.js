'use strict';

var mysql = require('mysql');
var Q = require('q');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '170989',
    database: 'nerd',
});

var getConnection = function() {
    // console.log('trying to connect');
    var deferred = Q.defer();
    pool.getConnection(function(err, connection) {
        if (err) {
            // console.log('error');
            deferred.reject(new Error('error retrieving connection'));
        } else {
            // console.log('connection accepted');
            deferred.resolve(connection);
        }
    });
    return deferred.promise;
};

var query = function(query, params) {
    return getConnection().then(function(connection) {
        var defer = Q.defer();
        connection.query(query, params, function(err, rows) {
            if (err) {
                defer.reject(err);
                // console.log(JSON.stringify(err));
            } else {
                // console.log(rows);
                connection.end();
                defer.resolve(rows);
            }
        });
        return defer.promise;
    });
};

module.exports.query = query;
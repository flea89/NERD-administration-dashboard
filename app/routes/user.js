/*
 * GET users listing.
 */
'use strict';
var pool = require('./../config/mysql.js');
var Q = require('Q');
exports.list = function(req, res) {
    var year = '2012';
    var query = 'SELECT tokenTimeStamp as ts, COUNT(idUser) as number from user GROUP BY YEAR(tokenTimeStamp),MONTH(tokenTimeStamp),DAY(tokenTimeStamp)';

    pool.query(query)
        .then(function(data) {
        res.json(data);
    }).fail(function(e) {
        res.json(e);
    });
};
/*
 * GET users listing.
 */
'use strict';
var pool = require('./../config/mysql.js');
var Q = require('Q');

function timeHandler(req, res) {
    var timeAggregator = {
        day: ' GROUP BY YEAR(tokenTimeStamp),MONTH(tokenTimeStamp),DAY(tokenTimeStamp)',
        week: ' GROUP BY YEAR(tokenTimeStamp),WEEK(tokenTimeStamp)',
        month: ' GROUP BY YEAR(tokenTimeStamp),MONTH(tokenTimeStamp)',
        all: ' GROUP BY YEAR(tokenTimeStamp)'
    },
    selectDateFunction = {
        day: 'YEAR(tokenTimeStamp) AS year, MONTH(tokenTimeStamp) AS month, DAY(tokenTimeStamp) AS day',
        week: 'YEAR(tokenTimeStamp) AS year, WEEK(tokenTimeStamp) AS week',
        month: 'YEAR(tokenTimeStamp) AS year, MONTH(tokenTimeStamp) AS month',
        all: 'YEAR(tokenTimeStamp) AS year'
    },
    filter, query,
    filterType = req.query.filterType,
        reqFilter = req.query.filter,
        reqTimeAggragator = req.query.timeAggregator;

    console.log('timeAggregator: ' + reqTimeAggragator);
    console.log('filterType: ' + filterType);
    console.log('filter: ' + reqFilter);

    switch (filterType) {
        case undefined:
            filter = '';
            break;
        case '':
            filter = '';
            break;
        case 'numberAnnotation':
            // TODO
            break;
        default:
            if (reqFilter) {
                filter = 'WHERE ' + filterType + ' = "' + reqFilter + '"';
            } else {
                throw new Error('Filter has to be Defined');
            }
            break;

    }
    query = 'SELECT ' + selectDateFunction[reqTimeAggragator] + ', COUNT(idUser) as number from user ' + filter + ' ' + timeAggregator[reqTimeAggragator];
    console.log('query: ' + query);
    return pool.query(query);
}


function groupByHandler(req, res) {
    var filter, query,
    groupBy = req.query.groupBy;
    console.log(groupBy);
    // switch (filterType) {
    //     case undefined:
    //         req.send('groupby is not defined');
    //         return;
    //         break;
    //     case 'numberAnnotation':
    //         // TODO
    //         break;
    //     default:
    //         if (reqFilter) {
    //             filter = 'WHERE ' + filterType + ' = ' + reqFilter;
    //         } else {
    //             throw new Error('Filter has to be Defined');
    //         }
    //         break;

    // }
    if (!groupBy) {
        res.json('invalid request, groupby is not defined');
    }

    query = 'SELECT ' + groupBy + ', COUNT(*) as number FROM user GROUP BY ' + groupBy;

    return pool.query(query);
}



exports.list = function(req, res) {
    var year = '2012';
    var query = 'SELECT tokenTimeStamp as ts, COUNT(idUser) as number from user GROUP BY YEAR(tokenTimeStamp),MONTH(tokenTimeStamp),DAY(tokenTimeStamp)';
    var queryPromise;

    var type = {
        time: timeHandler,
        groupBy: groupByHandler
    };

    console.log('type: ' + req.query.type);

    if (type[req.query.type]) {
        queryPromise = type[req.query.type](req, res);
    } else {
        console.log('Type is not Defined');
        res.json('invalid request type is not defined');
        return;
    }



    queryPromise.then(function(data) {
        res.json(data);
    }).fail(function(e) {
        res.json(e);
    });
};
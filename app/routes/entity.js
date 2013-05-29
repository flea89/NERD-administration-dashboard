/*
 * GET users listing.
 */
'use strict';
var pool = require('./../config/mysql.js');
var Q = require('q');

function timeHandler(req, res) {
	var timeAggregator = {
		day: ' GROUP BY YEAR(timestamp),MONTH(timestamp),DAY(timestamp)',
		week: ' GROUP BY YEAR(timestamp),WEEK(timestamp)',
		month: ' GROUP BY YEAR(timestamp),MONTH(timestamp)',
		all: ' GROUP BY YEAR(timestamp)'
	},
		selectDateFunction = {
			day: 'YEAR(timestamp) AS year, MONTH(timestamp) AS month, DAY(timestamp) AS day',
			week: 'YEAR(timestamp) AS year, WEEK(timestamp) AS week',
			month: 'YEAR(timestamp) AS year, MONTH(timestamp) AS month',
			all: 'YEAR(timestamp) AS year'
		},
		filter, query, groupByFilter = '',
		nestedQuery = false,
		filters = req.query.filters,
		reqTimeAggragator = req.query.timeAggregator;

	// console.log(filters);
	switch (filters) {
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
			if (filters) {
				filters = JSON.parse(filters);
				filter = ' AND ';
				filters.forEach(function(element, index) {
					if (element.dimension === 'nerdType') {
						groupByFilter = ' , nerdType';
					}

					filter += element.dimension + ' ' + element.operator + ' "' + element.value + '"';
					console.log(filters, filters.length, index);
					if (index !== filters.length - 1) {
						filter += ' AND ';
					}
				});
			} else {
				throw new Error('Filter has to be Defined');
			}
			break;

	}
	// console.log(filter);

	query = 'SELECT ' + selectDateFunction[reqTimeAggragator] +
		', COUNT(idEntity) as number FROM entity as e, annotation as a WHERE e.annotationIdAnnotation = a.idAnnotation ' + filter + ' ' + timeAggregator[reqTimeAggragator] + groupByFilter;


	console.log('query: ' + query);
	return pool.query(query);
}


function groupByHandler(req, res) {

	//TODO
	var filters, query, filter = '',
		groupByFilter = '',
		groupBy,
		groupBy = req.query.groupBy;
	filters = req.query.filters
	switch (filters) {
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
			if (filters) {
				filters = JSON.parse(filters);
				filter = ' AND ';
				filters.forEach(function(element, index) {

					filter += element.dimension + ' ' + element.operator + ' "' + element.value + '"';
					groupByFilter += ' , ' + element.dimension;
					console.log(filters, filters.length, index);
					if (index !== filters.length - 1) {
						filter += ' AND ';
					}
				});
			} else {
				throw new Error('Filter has to be Defined');
			}
			break;

	}
	if (!groupBy) {
		res.json('invalid request, groupby is not defined');
	}

	query = 'SELECT ' + groupBy + ' , COUNT(idEntity) as number FROM entity as e, annotation as a WHERE e.annotationIdAnnotation = a.idAnnotation ' + filter + ' GROUP BY ' + groupBy + ' ORDER BY  COUNT(idEntity) DESC';
	console.log(query);
	return pool.query(query);
}



exports.list = function(req, res) {
	var year = '2012';
	var query = 'SELECT timestamp as ts, COUNT(idUser) as number from user GROUP BY YEAR(timestamp),MONTH(timestamp),DAY(timestamp)';
	var queryPromise;

	var type = {
		time: timeHandler,
		groupBy: groupByHandler
	};

	// console.log('type: ' + req.query.type);

	if (type[req.query.type]) {
		queryPromise = type[req.query.type](req, res);
	} else {
		// console.log('Type is not Defined');
		res.json('invalid request type is not defined');
		return;
	}



	queryPromise.then(function(data) {
		res.json(data);
	}).fail(function(e) {
		res.json(e);
	});
};
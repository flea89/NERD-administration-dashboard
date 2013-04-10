'use strict';

angular.module('publicApp')
    .factory('ajax', function($resource) {
    var ajax = $resource('/users');

    function getFriday(weekNum, year) {
        var DAY = 86400000;
        var year = new Date(year.toString()); // toString first so it parses correctly year numbers
        var daysToFriday = (5 - year.getDay()); // Note that this can be also negative
        var fridayOfFirstWeek = new Date(year.getTime() + daysToFriday * DAY);
        var nthFriday = new Date(fridayOfFirstWeek.getTime() + (7 * (weekNum - 1) * DAY));
        return nthFriday;
    }

    function createDate(item) {

        if (item.week) {
            return getFriday(item.week, item.year);
        }
        var month = item.month ? item.month : 0;
        var day = item.day ? item.day : 1;
        return new Date(item.year, month - 1, day);
    }

    function getUsersTimeLineFiltered(aggregation, filterType, filter, success, fail) {
        return getUsersTimeLine(aggregation, success, fail, filterType, filter);

    }

    function getUsersTimeLine(aggregation, success, fail, filterType, filter) {
        var group,
        aggregationConfig = {
            day: {
                range: 'month',
            },
            week: {
                range: 'year'
            },
            month: {
                range: 'year'
            },
            year: {
                range: null
            }

        },
        returnData = [];


        if (returnData.length < 1) {
            ajax.query({
                type: 'time',
                timeAggregator: aggregation,
                filterType: filterType === undefined ? '' : filterType,
                filter: filter === undefined ? '' : filter
            }, function(res) {
                res.reduce(

                function reduceDates(prev, curr) {
                    if (prev[aggregationConfig[aggregation].range] !== curr[aggregationConfig[aggregation].range]) {
                        returnData.push(group);
                        group = {
                            title: curr[aggregationConfig[aggregation].range],
                            array:   [
                                [
                                createDate(curr), curr.number]
                            ]
                        };
                    } else {
                        group.array.push([createDate(curr), curr.number]);
                    }
                    return curr;
                }, {});
                if (group) {
                    returnData.push(group);
                }

                if (typeof success === 'function') {
                    success(res);
                }
            },

            function() {
                console.log('UserQueryError');
                if (typeof fail === 'function') {
                    fail();
                }
            });
            return returnData;
        } else {
            if (typeof success === 'function') {
                success();
            }
            return returnData;
        }
    }

    function getUsersGroupBy(aggregation, success, fail) {

        var data = [
            [aggregation, 'Number']
        ];
        ajax.query({
            type: 'groupBy',
            groupBy: aggregation
        }, function(res) {
            res.forEach(function(e) {
                data.push([e[aggregation], e.number]);
            });
        }, function() {});

        return data;
    }

    return {
        getUsersTimeLine: getUsersTimeLine,
        getUsersGroupBy: getUsersGroupBy,
        getUsersTimeLineFiltered: getUsersTimeLineFiltered
    };

});
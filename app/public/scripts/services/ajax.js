'use strict';

angular.module('publicApp')
    .factory('ajax', function($resource, $q) {
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

    function getUsersTimeLineFiltered(aggregation, filters, success, fail) {
        return getUsersTimeLine(aggregation, success, fail, filters);
    }

    function getUsersTimeLine(aggregation, success, fail, filter) {
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
        returnData = [],
            defer = $q.defer();


        if (returnData.length < 1) {
            var ajaxReq = {
                type: 'time',
                timeAggregator: aggregation,
            };

            if (filter && filter.length > 0) {
                ajaxReq.filters = JSON.stringify(filter);
            }


            ajax.query(ajaxReq, function(res) {
                res.reduce(

                function reduceDates(prev, curr) {
                    if (prev[aggregationConfig[aggregation].range] !== curr[aggregationConfig[aggregation].range]) {
                        if (group) {
                            returnData.push(group);
                        }
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
                defer.resolve(returnData);
            },

            function() {
                console.log('UserQueryError');
                if (typeof fail === 'function') {
                    fail();
                }
                defer.reject('UserQueryError');
            });

            return defer.promise;
        } else {
            if (typeof success === 'function') {
                success();
            }
            return defer.promise;
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
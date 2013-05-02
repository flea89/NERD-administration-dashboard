'use strict';

angular.module('publicApp')
    .factory('entity', function($resource, $q) {

    var ajax = $resource('/entities');

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


    function getUsersTimeLine(aggregation, filter) {
        var group,
        titleDate,
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
                        if (aggregation === 'day') {
                            titleDate = createDate({
                                year: curr.year,
                                month: curr.month
                            });
                        } else {
                            titleDate = createDate({
                                year: curr.year
                            });
                        }
                        group = {
                            title: titleDate.getTime(),
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
                defer.resolve(returnData);
            }, function() {
                console.log('UserQueryError');
                defer.reject('UserQueryError');
            });

        } else {
            defer.resolve(returnData);
        }
        return defer.promise;
    }

    function getUsersGroupBy(aggregation, filters, success, fail) {
        var defer = $q.defer();
        var data = [
            [aggregation, 'Number']
        ];
        var ajaxReq = {
            type: 'groupBy',
            groupBy: aggregation,
        };

        if (filters && filters.length > 0) {
            ajaxReq.filters = JSON.stringify(filters);
        }



        ajax.query(ajaxReq, function(res) {
            res.forEach(function(e) {
                data.push([e[aggregation], e.number]);
            });
            defer.resolve(data);
        }, function() {
            defer.reject(new Error('error'));
        });

        return defer.promise;
    }

    return {
        getUsersTimeLine: getUsersTimeLine,
        getUsersGroupBy: getUsersGroupBy,
    };

});
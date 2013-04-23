'use strict';

angular.module('publicApp')
    .directive('timeline', function() {
    return {
        transclude: 'true',
        scope: {
            data: '=',
            title: '@',
            changev: '&',
            options: '@'
        },
        template: ['<div class="graph-box">',
            '<div class="graph-title"><span class="text-title">{{title}}</span>',
            '<span class="navigationControls hidden-phone"><div class="btn prev">prev</div>',
            '<div class="btn disabled succ">succ</div>',
            '</span>',
            '<div class="btn button-collapse">collapse</div>',
            '<a href="#myModal" role="button" class="btn" data-toggle="modal" data-target="#{{options}}" ng-show="options">opt</a>',
            '</div>',
            '<div class="chart" id="chart_div" ></div><div class="control"></div>',
            '<span class="visualizationControls hidden-phone"><div class="btn disabled" ng-click="click()">Day</div> ',
            '<div class="btn">Week</div>',
            '<div class="btn">Month</div>',
            '<div class="btn">Year</div></span>',
            '<div ng-transclude></div>'].join('\n'),

        restrict: 'EA',
        link: function postLink(scope, element, attrs) {
            var gridLines = {
                month: 12,
                week: 54,
                day: 31
            };
            scope.visualization = 'day';
            scope.indexTimeView = 1;

            var graph = $(element[0]).find('.chart')[0];
            var annotatedtimeline = new google.visualization.LineChart(graph);
            var data;
            var navigationControls = {
                prev: $(element[0]).find('.prev'),
                succ: $(element[0]).find('.succ')
            };

            var overlay = $(element[0]).find('#overlay')[0];

            var options;


            scope.$watch('data', function() {
                if (scope.data.length > 0) {
                    scope.indexTimeView = scope.data.length - 1;
                    options = {
                        animation: {
                            duration: 500
                        },
                        hAxis: {
                            title: 'Time',
                            gridlines: {
                                count: 8,
                            }
                        },
                        vAxis: {
                            title: 'Number',
                            minValue: 0
                        },
                        chartArea: {
                            width: '90%',
                            height: '600px',
                            left: 50
                        },
                        legend: {
                            position: 'left'
                        },
                        pointSize: 6
                    };

                    setDateAxis(options);
                    setTitle(options);
                    checkNavigationControls();
                    data = new google.visualization.DataTable();
                    data.addColumn('date', 'Date');
                    data.addColumn('number', 'Registration');
                    scope.data[scope.indexTimeView].array.forEach(function(el) {
                        data.addRow(el);
                    });
                    annotatedtimeline.draw(data, options);
                }
            }, true);

            $('a.brand').click(function() {
                $(graph).fadeOut(300).fadeIn(400);
                setTimeout(function() {
                    annotatedtimeline.draw(data, options);

                }, 300);


            });

            $(element[0]).find('.visualizationControls > .btn').click(function(event) {
                var targetText = $(event.target).html().toLowerCase();
                $(event.target).addClass('disabled');
                $(event.target).siblings().removeClass('disabled');
                scope.changev({
                    visualization: targetText
                });
                scope.indexTimeView = scope.data.length - 1;
                scope.visualization = targetText;

                // setDateAxis(options);
                // setTitle(options);
                // data = new google.visualization.DataTable();
                // data.addColumn('date', 'Date');
                // data.addColumn('number', 'Registration');
            });

            $(element[0]).find('.navigationControls > .btn').click(function(event) {
                var controls = {
                    prev: function() {
                        scope.indexTimeView -= 1;
                        if (scope.indexTimeView < 2) {
                            scope.indexTimeView = 1;
                        }
                        return scope.data[scope.indexTimeView];
                    },
                    succ: function() {
                        scope.indexTimeView += 1;
                        if (scope.indexTimeView >= scope.data.length - 1) {
                            scope.indexTimeView = scope.data.length - 1;
                        }
                        return scope.data[scope.indexTimeView];
                    }
                };
                data = new google.visualization.DataTable();
                data.addColumn('date', 'Date');
                data.addColumn('number', 'Registration');

                controls[$(event.target).html()]().array.forEach(function(el) {
                    data.addRow(el);
                });
                setTitle(options);
                checkNavigationControls();
                annotatedtimeline.draw(data, options);

            });

            function checkNavigationControls() {

                navigationControls.succ.removeClass('disabled');
                navigationControls.prev.removeClass('disabled');
                if (scope.indexTimeView < 2) {
                    navigationControls.prev.addClass('disabled');

                }
                if (scope.indexTimeView >= scope.data.length - 1) {
                    navigationControls.succ.addClass('disabled');
                }
            }

            function setDateAxis(options) {
                var format = {
                    day: 'd',
                    week: 'MMM d',
                    month: ' MMM',
                    year: 'y'
                };
                options.hAxis.format = format[scope.visualization];
            }

            function setTitle(options) {
                options.title = scope.data[scope.indexTimeView].title;
            }

            $('.content').touchwipe({
                wipeRight: function() {
                    scope.indexTimeView -= 1;
                    if (scope.indexTimeView < 2) {
                        scope.indexTimeView = 1;
                    }
                    data = new google.visualization.DataTable();
                    data.addColumn('date', 'Date');
                    data.addColumn('number', 'Registration');
                    scope.data[scope.indexTimeView].array.forEach(function(el) {
                        data.addRow(el);
                    });
                    setTitle(options);
                    annotatedtimeline.draw(data, options);

                },
                wipeLeft: function() {
                    scope.indexTimeView += 1;
                    if (scope.indexTimeView >= scope.data.length - 1) {
                        scope.indexTimeView = scope.data.length - 1;
                    }
                    data = new google.visualization.DataTable();
                    data.addColumn('date', 'Date');
                    data.addColumn('number', 'Registration');
                    scope.data[scope.indexTimeView].array.forEach(function(el) {
                        data.addRow(el);
                    });
                    setTitle(options);
                    annotatedtimeline.draw(data, options);


                }
            });

            // optButton.onclick = function() {
            //     $(timelineOptions).addClass('opt-in');
            //     $(overlay).addClass('fade-in');
            // };

            // timelineOptionsClose.onclick = function() {
            //     $(timelineOptions).removeClass('opt-in');
            //     $(overlay).removeClass('fade-in');
            // };
        }
    };
});
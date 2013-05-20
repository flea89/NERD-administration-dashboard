'use strict';

angular.module('publicApp')
    .directive('timeline', function() {
    return {
        transclude: 'true',
        scope: {
            data: '=',
            title: '@',
            changev: '&',
            options: '@',
            multiline: '@',
            dataset: '='
        },
        template: ['<div class="graph-box">',
            '<div class="graph-title"><span class="text-title">{{title}}</span>',
            '<span class="navigationControls hidden-phone"><div class="btn prev" data-shift="prev"><i class="icon-chevron-left" data-shift="prev"></i></div>',
            '<div class="btn disabled succ" data-shift="succ"><i class="icon-chevron-right" data-shift="succ"></i></div>',
            '</span>',
            '<span style="float: right">',
            '<span class="btn-group visualizationControls">',
            '<a class="dropdown-toggle" ng-class="" data-toggle="dropdown" href=""><i class="icon-th-large visualizationIcon"></i></a>',
            '<ul class="pull-right dropdown-menu">',
            '<li><a class="btnv disabled " ng-click="click()" data-visualization="day">Day</a> </li>',
            '<li><a class="btnv" data-visualization="week" >Week</a> </li>',
            '<li><a class="btnv" data-visualization="month">Month</a> </li>',
            '<li><a class="btnv" data-visualization="year">Year</a> </li>',
            '</ul></span>',
            '<a href="#myModal" role="button" data-toggle="modal" data-target="#{{options}}" ng-show="options"><i class="icon-cog configIcon"></i></a>',
            '<span class="button-collapse"><i class="icon-chevron-down" ></i></span>',
            '</span>',
            '</div>',
            '<div class="chart" id="chart_div" ></div><div class="control"></div>',
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
                if (scope.data.length > 1) {
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
                            left: '100px',
                            width: '75%',
                            height: '600px',
                        },
                        legend: {
                            position: 'right'
                        },
                        pointSize: 6
                    };

                    setDateAxis(options);
                    setTitle(options);
                    checkNavigationControls();
                    createDataTable();
                    setTitle(options);
                    annotatedtimeline.draw(scope.dataTable, options);
                }
            }, true);

            $('a.brand').click(function() {
                $(graph).fadeOut(300).fadeIn(400);
                setTimeout(function() {
                    annotatedtimeline.draw(scope.dataTable, options);

                }, 300);


            });

            $(element[0]).find('.visualizationControls .btnv').click(function(event) {
                var targetText = $(event.target).data('visualization').toLowerCase();
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
                        if (scope.indexTimeView < 1) {
                            scope.indexTimeView = 0;
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
                data = createDataTable(controls);
                setTitle(options);
                checkNavigationControls();
                annotatedtimeline.draw(scope.dataTable, options);

            });

            function checkNavigationControls() {

                navigationControls.succ.removeClass('disabled');
                navigationControls.prev.removeClass('disabled');
                if (scope.indexTimeView < 1) {
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
                options.title = new Date(scope.data[scope.indexTimeView].title);
            }

            $(element[0]).touchwipe({
                wipeRight: function() {
                    scope.indexTimeView -= 1;
                    if (scope.indexTimeView < 2) {
                        scope.indexTimeView = 1;
                    }
                    data = createDataTable();
                    setTitle(options);
                    annotatedtimeline.draw(scope.dataTable, options);

                },
                wipeLeft: function() {
                    scope.indexTimeView += 1;
                    if (scope.indexTimeView >= scope.data.length - 1) {
                        scope.indexTimeView = scope.data.length - 1;
                    }
                    data = createDataTable();
                    setTitle(options);
                    annotatedtimeline.draw(scope.dataTable, options);


                }
            });

            function createDataTable(controls) {
                scope.dataTable = new google.visualization.DataTable();
                scope.dataTable.addColumn('date', 'Date');
                if (scope.dataset === undefined) {
                    scope.dataTable.addColumn('number', 'Registration');
                } else {
                    if (scope.dataset.filters && scope.dataset.filters.length > 0) {
                        for (var i = 0; i < scope.dataset.filters.length; i++) {
                            scope.dataTable.addColumn('number', 'Line ' + i + 1);
                        }
                    }
                }

                if (controls) {
                    controls[$(event.target).data('shift')]().array.forEach(function(el) {
                        scope.dataTable.addRow(el);
                    });
                } else {
                    scope.data[scope.indexTimeView].array.forEach(function(el) {
                        scope.dataTable.addRow(el);
                    });
                }



            }
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
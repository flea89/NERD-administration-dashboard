'use strict';

angular.module('publicApp')
    .directive('geochart', function() {
    return {
        template: ['<div class="graph-box">',
            '<div class="graph-title"><span class="text-title">{{title}}</span>',
            '<div class="btn button-collapse">collapse</div>',
            '</div>',
            '<div class="chart" id="chart_div" style=" height: 270px; ></div><div class="control"></div></div>'].join('\n'),
        restrict: 'EA',
        scope: {
            title: '@',
            data: '='
        },
        link: function postLink(scope, element, attrs) {
            var table, options,
            chartDiv = $(element[0]).find('#chart_div')[0];
            var chart = new google.visualization.GeoChart(chartDiv);

            scope.$watch('data', function() {

                if (scope.data.length > 1) {
                    console.log(scope.data);
                    table = google.visualization.arrayToDataTable(scope.data);
                    options = {
                        title: scope.title,
                        region: 150
                    };
                    chart.draw(table, options);
                }

            }, true);

            $('a.brand').click(function() {
                $(chartDiv).fadeOut(300).fadeIn(400);
                setTimeout(function() {
                    chart.draw(table, options);

                }, 300);


            });


        }
    };
});
'use strict';

angular.module('publicApp')
    .directive('timeline', function() {
    return {
        template: '<div class="topChart">chartTitl</div><div class="chart" id="chart_div" style="width: 700px; height: 240px;"></div><div class="control"></div>',
        scope: {
            data: '='
        },
        restrict: 'EA',
        link: function postLink(scope, element, attrs) {

            var annotatedtimeline = new google.visualization.AnnotatedTimeLine($(element[0]).children('.chart')[0]);
            var data = new google.visualization.DataTable();

            data.addColumn('date', 'Date');
            data.addColumn('number', 'Registration');

            scope.$watch('data', function() {

                if (scope.data.length > 0) {
                    scope.data.forEach(function(el) {
                        console.log(el);
                        data.addRow(el);
                    });

                    annotatedtimeline.draw(data, {
                        'displayAnnotations': true,
                        'displayRangeSelector': false,
                        'thickness': 2,
                        'displayZoomButtons': false,
                        'wmode': 'transparent',
                        'zoomEndTime': new Date(),
                        'zoomStartTime': new Date(new Date().getTime() - 604800000),
                        'colors': ['red']
                    });
                }
            }, true);

        }
    };
});
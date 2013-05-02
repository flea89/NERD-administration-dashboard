'use strict';

angular.module('publicApp')
    .controller('FixedBarCtrl', function($scope, ajax, $q) {
    $scope.data = [];
    ajax.getUsersTimeLine('day').then(function(result) {
        $scope.data = result;
    });
    $scope.pieDataCountry = ajax.getUsersGroupBy('country');
    $scope.pieDataLanguage = ajax.getUsersGroupBy('language');

    $scope.geoDataCountry = ajax.getUsersGroupBy('country');
    $scope.filterTypes = ['country', 'language'];
    $scope.setData = function(visualization) {
        $scope.data = ajax.getUsersTimeLine(visualization);
    };



    $scope.dataFiltered = {
        dataset: [
            [{
                dimension: 'country',
                operator: '=',
                value: 'greece'
            }, {
                dimension: 'language',
                operator: '=',
                value: 'english'
            }],
            [{
                dimension: 'language',
                operator: '=',
                value: 'french'
            }]
        ],
        data: [
            []
        ],
        visualization: 'day',
        updateLines: function(newDataset) {
            var fail = false;
            var lines = [];
            var linesPromises = [];
            var that = this;
            var fetchLinesPromise;
            this.dataset = newDataset;

            newDataset.forEach(function(el, index) {
                linesPromises[index] = ajax.getUsersTimeLine(that.visualization, el).then(function(res) {
                    lines[index] = res;
                });
            });
            fetchLinesPromise = $q.all(linesPromises);
            fetchLinesPromise.then(function() {
                that.data = mergeLinesInArrayTable(lines);
            });
        },
        changeVisualization: function(visualization) {
            this.visualization = visualization;
            this.updateLines(this.dataset);
        }
    };


    function mergeLinesInArrayTable(lines) {
        var max = lines[0].max('title'),
            min = lines[0].min('title'),
            data = [],
            inserted,
            newPoint, group, groupOfLine;
        lines.forEach(function(line) {
            var maxOfLine = line.max('title'),
                minOfLine = line.min('title');

            if (maxOfLine > max) {
                max = maxOfLine;
            }
            if (minOfLine < min) {
                min = minOfLine;
            }
        });

        var titles = [];

        lines.forEach(function(el) {
            titles = titles.concat(el.map(function(e) {
                return e.title;
            }));
        });
        titles = titles.unique();
        titles.sort();
        titles.forEach(function(title, index) {
            group = {
                title: title,
                array: []
            };
            inserted = false;
            for (var j = 0; j < lines.length; j++) {
                groupOfLine = lines[j].getByProperty('title', title);
                if (groupOfLine) {
                    groupOfLine.array.forEach(function(point) {
                        newPoint = new Array(lines.length + 1);
                        newPoint.forEach(function(el) {
                            el = undefined;
                        });
                        newPoint[0] = point[0];
                        newPoint[j + 1] = point[1];
                        group.array.push(newPoint);
                        inserted = true;
                    });
                }

            }
            if (inserted) data.push(group);
        });
        return data;
    }
    $scope.dataFiltered.updateLines($scope.dataFiltered.dataset);
    // $scope.dataFiltered2 = ajax.getUsersTimeLine('day', [{
    //     dimension: 'country',
    //     operator: 'equal',
    //     value: 'greece'
    // }]);
    // // $scope.setDataFiltered = function(visualization) {
    // //     $scope.dataFiltered = ajax.getUsersTimeLine(visualization, [{
    // //         dimension: 'country',
    // //         operator: '=',
    // //         value: 'greece'
    // //     }, {
    // //         dimension: 'language',
    // //         operator: '=',
    // //         value: 'english'
    // //     }]);
    // // };
});
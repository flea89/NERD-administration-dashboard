'use strict';

angular.module('publicApp')
    .controller('FixedBarCtrl', function($scope, ajax, $q, filters) {
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
        dataset: {
            idFilter: undefined,
            filters: [
                []
            ]
        },
        data: [
            []
        ],
        visualization: 'day',
        updateLines: function(newDataset) {
            var fail = false,
                lines = [],
                linesPromises = [],
                that = this,
                fetchLinesPromise;
            this.dataset.filters = newDataset.filters;
            this.dataset.idFilter = newDataset.idFilter;
            newDataset.filters.forEach(function(el, index) {
                linesPromises[index] = ajax.getUsersTimeLine(that.visualization, el).then(function(res) {
                    lines[index] = res;
                });
            });
            fetchLinesPromise = $q.all(linesPromises);
            fetchLinesPromise.then(function() {
                that.data = mergeLinesInArrayTable(lines);
            });

            filters.putFilter(this.dataset.idFilter, 'user', angular.toJson(this.dataset.filters));
        },
        changeVisualization: function(visualization) {
            this.visualization = visualization;
            this.updateLines(this.dataset);
        }
    };



    // $scope.dataFiltered.dataset = filters.getFilter('user');
    // $scope.$watch('dataFiltered', function(newValue, oldValue) {
    //     if (newValue.dataset.filters.length > 0) {
    //         $scope.dataFiltered.updateLines($scope.dataFiltered.dataset);
    //     }
    // }, true);


    // $scope.initialDataset = filters.getFilter('user');
    filters.getFilter('user', function(filters) {
        $scope.dataFiltered.updateLines(filters);
    });

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


});
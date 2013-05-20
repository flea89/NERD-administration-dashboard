'use strict';

angular.module('publicApp')
    .controller('FixedBarCtrl', function($scope, ajax, $q, filters,mergeLine) {
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
                that.data = mergeLine.mergeLinesInArrayTable(lines);
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

    // $scope.$watch('initialDataset', function(newValue, oldValue) {
    //     if (newValue.filters.length > 0) {
    //         $scope.dataFiltered.updateLines(angular.copy($scope.initialDataset));
    //     }
    // }, true);

});
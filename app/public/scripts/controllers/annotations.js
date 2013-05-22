'use strict';

angular.module('publicApp')
    .controller('AnnotationsCtrl', function($scope, $q, annotations, filters, mergeLine) {

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
                linesPromises[index] = annotations.getUsersTimeLine(that.visualization, el).then(function(res) {
                    lines[index] = res;
                });
            });
            fetchLinesPromise = $q.all(linesPromises);
            fetchLinesPromise.then(function() {
                that.data = mergeLine.mergeLinesInArrayTable(lines);
            });

            // filters.putFilter(this.dataset.idFilter, 'user', angular.toJson(this.dataset.filters));
        },
        changeVisualization: function(visualization) {
            this.visualization = visualization;
            this.updateLines(this.dataset);
        }
    };
    $scope.dataFiltered.updateLines($scope.dataFiltered.dataset);


});
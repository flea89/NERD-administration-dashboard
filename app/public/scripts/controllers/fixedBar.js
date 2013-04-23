'use strict';

angular.module('publicApp')
    .controller('FixedBarCtrl', function($scope, ajax) {
    $scope.data = [];
    $scope.data = ajax.getUsersTimeLine('day');
    $scope.pieDataCountry = ajax.getUsersGroupBy('country');
    $scope.pieDataLanguage = ajax.getUsersGroupBy('language');

    $scope.geoDataCountry = ajax.getUsersGroupBy('country');
    $scope.filterTypes = ['country', 'language'];
    $scope.setData = function(visualization) {
        $scope.data = ajax.getUsersTimeLine(visualization);
    };



    $scope.dataFiltered = {
        dataset: [{
            dimension: 'language',
            operator: 'equal',
            value: 'french'
        }, {
            dimension: 'language',
            operator: '=',
            value: 'english'
        }],
        data: [
            []
        ],
        visualization: 'day',
        updateLines: function(newDataset) {
            var fail = false;
            newDataset.forEach(function(el, index) {
                this.data[index] = ajax.getUsersTimeLineFiltered(this.visualization, el, function() {}, function() {
                    fail = true;
                });
            });
            if (fail) {
                console.log('error');
            }
        },
        changeVisualization: function(visualization) {
            this.visualization = visualization;
            this.updateLines(this.dataset);
        }
    };

    // $scope.dataFiltered = ajax.getUsersTimeLineFiltered('day', [{
    //     dimension: 'country',
    //     value: 'greece'
    // }, {
    //     dimension: 'language',
    //     value: 'english'
    // }]);
    // // $scope.setDataFiltered = function(visualization) {
    // //     $scope.dataFiltered = ajax.getUsersTimeLineFiltered(visualization, [{
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
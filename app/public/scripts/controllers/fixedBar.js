'use strict';

angular.module('publicApp')
    .controller('FixedBarCtrl', function($scope, ajax) {
    $scope.data = [];
    $scope.pippo = 'pippo';
    $scope.data = ajax.getUsersTimeLine('day');
    $scope.pieDataCountry = ajax.getUsersGroupBy('country');
    $scope.pieDataLanguage = ajax.getUsersGroupBy('language');
    $scope.dataFilter = ajax.getUsersTimeLineFiltered('day', 'country', 'greece');
    $scope.geoDataCountry = ajax.getUsersGroupBy('country');
    $scope.setData = function(visualization) {
        $scope.data = ajax.getUsersTimeLine(visualization);
    };
    $scope.setDataFiltered = function(visualization) {
        $scope.dataFilter = ajax.getUsersTimeLineFiltered(visualization, 'country', 'greece');
    };
});
'use strict';

angular.module('publicApp')
    .controller('LoginCtrl', function($scope, $http, $location, $routeParams) {

    $scope.error = $routeParams.error;
    $scope.login = function() {
        $http({
            method: 'post',
            url: 'login',
            data: {
                username: $scope.username,
                password: $scope.password
            }
        }).success(function(data) {
            if (data.access !== 'denied') {
                $location.path('/');
            } else {
                $location.path('/login:error');
            }
        });

    };
});
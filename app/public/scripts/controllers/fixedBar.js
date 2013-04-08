'use strict';

angular.module('publicApp')
  .controller('FixedBarCtrl', function ($scope,ajax) {
    $scope.data = [];
    $scope.pippo = 'pippo';

    ajax.query(function(res){
        res.forEach(function(el){
            $scope.data.push([new Date(el.ts),el.number]);
        });
        console.log($scope.data);
    });

});

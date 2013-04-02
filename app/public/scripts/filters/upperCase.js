'use strict';

angular.module('puppaApp')
  .filter('upperCase', function () {
    return function (input) {
      return 'upperCase filter: ' + input;
    };
  });

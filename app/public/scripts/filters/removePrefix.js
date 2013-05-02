'use strict';

angular.module('publicApp')
    .filter('removePrefix', function() {
    return function(input) {
        return input.split('#')[1];
    };
});
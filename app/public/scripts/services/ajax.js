'use strict';

angular.module('publicApp')
    .factory('ajax', function($resource) {
    return $resource('/users', {
        id: '@id'
    }, {
        update: {
            method: 'PUT',
        }
    });

});
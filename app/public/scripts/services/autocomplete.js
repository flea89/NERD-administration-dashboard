'use strict';

angular.module('publicApp')
  .factory('autocomplete', function ($resource) {   
    var choices = $resource('/autocomplete');


    // Public API here
    return choices;
    });

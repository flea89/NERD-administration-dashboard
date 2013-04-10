'use strict';

angular.module('publicApp')
    .directive('collapse', function() {
    return {
        restrict: 'EA',
        link: function postLink(scope, element, attrs) {
            var buttonCollapse = $(element[0]).find('.button-collapse');

            var chart = $(element[0]).find('.chart');
            $(buttonCollapse).on('click', function() {
                $(chart).toggle(150);
            });
        }
    };
});
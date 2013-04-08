'use strict';

angular.module('publicApp')
  .directive('piechart', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the piechart directive');
      }
    };
  });

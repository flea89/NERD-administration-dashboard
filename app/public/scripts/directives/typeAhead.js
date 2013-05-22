'use strict';

angular.module('publicApp')
  .directive('typeAhead', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the typeAhead directive');
      }
    };
  });

'use strict';

describe('Directive: piechart', function () {
  beforeEach(module('publicApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<piechart></piechart>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the piechart directive');
  }));
});

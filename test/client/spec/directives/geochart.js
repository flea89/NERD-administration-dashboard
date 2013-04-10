'use strict';

describe('Directive: geochart', function () {
  beforeEach(module('publicApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<geochart></geochart>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the geochart directive');
  }));
});

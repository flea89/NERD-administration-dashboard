'use strict';

describe('Directive: typeAhead', function () {
  beforeEach(module('publicApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<type-ahead></type-ahead>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the typeAhead directive');
  }));
});

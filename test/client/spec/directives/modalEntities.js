'use strict';

describe('Directive: modalEntities', function () {
  beforeEach(module('publicApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<modal-entities></modal-entities>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the modalEntities directive');
  }));
});

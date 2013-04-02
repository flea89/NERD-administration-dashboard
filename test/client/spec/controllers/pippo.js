'use strict';

describe('Controller: PippoCtrl', function () {

  // load the controller's module
  beforeEach(module('puppaApp'));

  var PippoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    PippoCtrl = $controller('PippoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: FixedBarCtrl', function () {

  // load the controller's module
  beforeEach(module('puppaApp'));

  var FixedBarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    FixedBarCtrl = $controller('FixedBarCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

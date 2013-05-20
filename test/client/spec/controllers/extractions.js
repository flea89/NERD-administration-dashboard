'use strict';

describe('Controller: ExtractionsCtrl', function () {

  // load the controller's module
  beforeEach(module('publicApp'));

  var ExtractionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    ExtractionsCtrl = $controller('ExtractionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

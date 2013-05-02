'use strict';

describe('Controller: EntitiesCtrl', function () {

  // load the controller's module
  beforeEach(module('publicApp'));

  var EntitiesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    EntitiesCtrl = $controller('EntitiesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: AnnotationsCtrl', function () {

  // load the controller's module
  beforeEach(module('publicApp'));

  var AnnotationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    scope = {};
    AnnotationsCtrl = $controller('AnnotationsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

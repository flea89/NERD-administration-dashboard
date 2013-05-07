'use strict';

describe('Service: filters', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var filters;
  beforeEach(inject(function (_filters_) {
    filters = _filters_;
  }));

  it('should do something', function () {
    expect(!!filters).toBe(true);
  });

});

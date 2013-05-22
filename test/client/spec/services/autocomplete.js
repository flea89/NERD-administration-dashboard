'use strict';

describe('Service: autocomplete', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var autocomplete;
  beforeEach(inject(function (_autocomplete_) {
    autocomplete = _autocomplete_;
  }));

  it('should do something', function () {
    expect(!!autocomplete).toBe(true);
  });

});

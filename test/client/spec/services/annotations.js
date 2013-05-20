'use strict';

describe('Service: annotations', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var annotations;
  beforeEach(inject(function (_annotations_) {
    annotations = _annotations_;
  }));

  it('should do something', function () {
    expect(!!annotations).toBe(true);
  });

});

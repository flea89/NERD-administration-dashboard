'use strict';

describe('Service: mergeLine', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var mergeLine;
  beforeEach(inject(function (_mergeLine_) {
    mergeLine = _mergeLine_;
  }));

  it('should do something', function () {
    expect(!!mergeLine).toBe(true);
  });

});

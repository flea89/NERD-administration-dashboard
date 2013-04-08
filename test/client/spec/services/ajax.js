'use strict';

describe('Service: ajax', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var ajax;
  beforeEach(inject(function (_ajax_) {
    ajax = _ajax_;
  }));

  it('should do something', function () {
    expect(!!ajax).toBe(true);
  });

});

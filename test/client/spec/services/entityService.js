'use strict';

describe('Service: entityService', function () {

  // load the service's module
  beforeEach(module('publicApp'));

  // instantiate service
  var entityService;
  beforeEach(inject(function (_entityService_) {
    entityService = _entityService_;
  }));

  it('should do something', function () {
    expect(!!entityService).toBe(true);
  });

});

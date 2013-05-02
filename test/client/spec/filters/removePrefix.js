'use strict';

describe('Filter: removePrefix', function () {

  // load the filter's module
  beforeEach(module('publicApp'));

  // initialize a new instance of the filter before each test
  var removePrefix;
  beforeEach(inject(function ($filter) {
    removePrefix = $filter('removePrefix');
  }));

  it('should return the input prefixed with "removePrefix filter:"', function () {
    var text = 'angularjs';
    expect(removePrefix(text)).toBe('removePrefix filter: ' + text);
  });

});

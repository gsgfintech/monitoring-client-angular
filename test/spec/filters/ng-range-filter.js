'use strict';

describe('Filter: ngRangeFilter', function () {

  // load the filter's module
  beforeEach(module('monitorApp'));

  // initialize a new instance of the filter before each test
  var ngRangeFilter;
  beforeEach(inject(function ($filter) {
    ngRangeFilter = $filter('ngRangeFilter');
  }));

  it('should return the input prefixed with "ngRangeFilter filter:"', function () {
    var text = 'angularjs';
    expect(ngRangeFilter(text)).toBe('ngRangeFilter filter: ' + text);
  });

});

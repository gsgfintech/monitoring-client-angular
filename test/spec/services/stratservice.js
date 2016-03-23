'use strict';

describe('Service: stratService', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var stratService;
  beforeEach(inject(function (_stratService_) {
    stratService = _stratService_;
  }));

  it('should do something', function () {
    expect(!!stratService).toBe(true);
  });

});

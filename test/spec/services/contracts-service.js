'use strict';

describe('Service: contractsService', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var contractsService;
  beforeEach(inject(function (_contractsService_) {
    contractsService = _contractsService_;
  }));

  it('should do something', function () {
    expect(!!contractsService).toBe(true);
  });

});

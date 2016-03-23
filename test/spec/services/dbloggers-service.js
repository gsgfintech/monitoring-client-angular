'use strict';

describe('Service: dbloggersService', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var dbloggersService;
  beforeEach(inject(function (_dbloggersService_) {
    dbloggersService = _dbloggersService_;
  }));

  it('should do something', function () {
    expect(!!dbloggersService).toBe(true);
  });

});

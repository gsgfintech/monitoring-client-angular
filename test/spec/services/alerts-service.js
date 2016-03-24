'use strict';

describe('Service: alertsService', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var alertsService;
  beforeEach(inject(function (_alertsService_) {
    alertsService = _alertsService_;
  }));

  it('should do something', function () {
    expect(!!alertsService).toBe(true);
  });

});

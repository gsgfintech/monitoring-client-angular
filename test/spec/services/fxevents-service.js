'use strict';

describe('Service: fxeventsService', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var fxeventsService;
  beforeEach(inject(function (_fxeventsService_) {
    fxeventsService = _fxeventsService_;
  }));

  it('should do something', function () {
    expect(!!fxeventsService).toBe(true);
  });

});

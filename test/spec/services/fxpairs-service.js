'use strict';

describe('Service: fxpairsService', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var fxpairsService;
  beforeEach(inject(function (_fxpairsService_) {
    fxpairsService = _fxpairsService_;
  }));

  it('should do something', function () {
    expect(!!fxpairsService).toBe(true);
  });

});

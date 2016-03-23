'use strict';

describe('Service: tradeEnginesService', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var tradeEnginesService;
  beforeEach(inject(function (_tradeEnginesService_) {
    tradeEnginesService = _tradeEnginesService_;
  }));

  it('should do something', function () {
    expect(!!tradeEnginesService).toBe(true);
  });

});

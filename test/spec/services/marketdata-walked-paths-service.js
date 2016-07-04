'use strict';

describe('Service: marketdataWalkedPathsService', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var marketdataWalkedPathsService;
  beforeEach(inject(function (_marketdataWalkedPathsService_) {
    marketdataWalkedPathsService = _marketdataWalkedPathsService_;
  }));

  it('should do something', function () {
    expect(!!marketdataWalkedPathsService).toBe(true);
  });

});

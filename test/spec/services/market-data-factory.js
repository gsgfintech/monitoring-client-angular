'use strict';

describe('Service: marketDataFactory', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var marketDataFactory;
  beforeEach(inject(function (_marketDataFactory_) {
    marketDataFactory = _marketDataFactory_;
  }));

  it('should do something', function () {
    expect(!!marketDataFactory).toBe(true);
  });

});

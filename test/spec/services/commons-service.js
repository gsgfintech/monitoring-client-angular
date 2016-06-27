'use strict';

describe('Service: commonsService', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var commonsService;
  beforeEach(inject(function (_commonsService_) {
    commonsService = _commonsService_;
  }));

  it('should do something', function () {
    expect(!!commonsService).toBe(true);
  });

});

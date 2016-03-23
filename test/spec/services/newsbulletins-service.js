'use strict';

describe('Service: newsbulletinsService', function () {

  // load the service's module
  beforeEach(module('monitorApp'));

  // instantiate service
  var newsbulletinsService;
  beforeEach(inject(function (_newsbulletinsService_) {
    newsbulletinsService = _newsbulletinsService_;
  }));

  it('should do something', function () {
    expect(!!newsbulletinsService).toBe(true);
  });

});

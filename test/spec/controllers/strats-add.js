'use strict';

describe('Controller: StratsAddCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var StratsAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StratsAddCtrl = $controller('StratsAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StratsAddCtrl.awesomeThings.length).toBe(3);
  });
});

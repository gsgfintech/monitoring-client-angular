'use strict';

describe('Controller: SystemsServiceEditControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var SystemsServiceEditControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SystemsServiceEditControllerCtrl = $controller('SystemsServiceEditControllerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SystemsServiceEditControllerCtrl.awesomeThings.length).toBe(3);
  });
});

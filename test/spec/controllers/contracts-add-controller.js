'use strict';

describe('Controller: ContractsAddControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var ContractsAddControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContractsAddControllerCtrl = $controller('ContractsAddControllerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ContractsAddControllerCtrl.awesomeThings.length).toBe(3);
  });
});

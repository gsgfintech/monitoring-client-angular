'use strict';

describe('Controller: ContractsEditControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var ContractsEditControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContractsEditControllerCtrl = $controller('ContractsEditControllerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ContractsEditControllerCtrl.awesomeThings.length).toBe(3);
  });
});

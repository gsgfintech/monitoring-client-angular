'use strict';

describe('Controller: ContractsDeleteControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var ContractsDeleteControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContractsDeleteControllerCtrl = $controller('ContractsDeleteControllerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ContractsDeleteControllerCtrl.awesomeThings.length).toBe(3);
  });
});

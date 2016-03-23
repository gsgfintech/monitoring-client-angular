'use strict';

describe('Controller: ConverterServiceEditControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var ConverterServiceEditControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConverterServiceEditControllerCtrl = $controller('ConverterServiceEditControllerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConverterServiceEditControllerCtrl.awesomeThings.length).toBe(3);
  });
});

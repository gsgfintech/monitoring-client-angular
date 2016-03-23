'use strict';

describe('Controller: ConverterServiceCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var ConverterServiceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConverterServiceCtrl = $controller('ConverterServiceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConverterServiceCtrl.awesomeThings.length).toBe(3);
  });
});

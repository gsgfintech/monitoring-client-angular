'use strict';

describe('Controller: StratStratedgeControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var StratStratedgeControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StratStratedgeControllerCtrl = $controller('StratStratedgeControllerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StratStratedgeControllerCtrl.awesomeThings.length).toBe(3);
  });
});

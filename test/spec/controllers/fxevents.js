'use strict';

describe('Controller: FxeventsCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var FxeventsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FxeventsCtrl = $controller('FxeventsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FxeventsCtrl.awesomeThings.length).toBe(3);
  });
});

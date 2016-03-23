'use strict';

describe('Controller: StratsEditCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var StratsEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StratsEditCtrl = $controller('StratsEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StratsEditCtrl.awesomeThings.length).toBe(3);
  });
});

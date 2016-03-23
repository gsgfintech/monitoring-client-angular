'use strict';

describe('Controller: StratsCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var StratsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StratsCtrl = $controller('StratsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StratsCtrl.awesomeThings.length).toBe(3);
  });
});

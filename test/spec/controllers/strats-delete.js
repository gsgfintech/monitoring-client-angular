'use strict';

describe('Controller: StratsDeleteCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var StratsDeleteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StratsDeleteCtrl = $controller('StratsDeleteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StratsDeleteCtrl.awesomeThings.length).toBe(3);
  });
});

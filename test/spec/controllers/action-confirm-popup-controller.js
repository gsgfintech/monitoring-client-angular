'use strict';

describe('Controller: ActionConfirmPopupControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var ActionConfirmPopupControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActionConfirmPopupControllerCtrl = $controller('ActionConfirmPopupControllerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActionConfirmPopupControllerCtrl.awesomeThings.length).toBe(3);
  });
});

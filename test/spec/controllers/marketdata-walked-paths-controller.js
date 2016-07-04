'use strict';

describe('Controller: MarketdataWalkedPathsControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var MarketdataWalkedPathsControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MarketdataWalkedPathsControllerCtrl = $controller('MarketdataWalkedPathsControllerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MarketdataWalkedPathsControllerCtrl.awesomeThings.length).toBe(3);
  });
});

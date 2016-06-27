'use strict';

describe('Controller: IndexTitleControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('monitorApp'));

  var IndexTitleControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IndexTitleControllerCtrl = $controller('IndexTitleControllerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IndexTitleControllerCtrl.awesomeThings.length).toBe(3);
  });
});

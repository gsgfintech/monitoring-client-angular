'use strict';

describe('Directive: marketdataWalkedPathsChartDirective', function () {

  // load the directive's module
  beforeEach(module('monitorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<marketdata-walked-paths-chart-directive></marketdata-walked-paths-chart-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the marketdataWalkedPathsChartDirective directive');
  }));
});

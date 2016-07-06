'use strict';

describe('Directive: executionsPnlChartDirective', function () {

  // load the directive's module
  beforeEach(module('monitorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<executions-pnl-chart-directive></executions-pnl-chart-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the executionsPnlChartDirective directive');
  }));
});

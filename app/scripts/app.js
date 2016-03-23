'use strict';

angular.module('monitorApp', ['angularSpinner', 'SignalR', 'ui.bootstrap', 'ngAnimate', 'ngFileSaver', 'ngRangeFilter', 'ngResource', 'ngRoute', 'ngSanitize',
    'toaster', 'ui.router', 'ui.bootstrap', 'ui.router.tabs', 'uiSwitch'])
.constant('serverEnpoint', 'http://localhost:51468/')
.constant('marketDataServiceEnpoint', 'https://tryphon.gsg.capital:6581/')
.constant('systemsServiceEnpoint', 'https://tryphon.gsg.capital:6582/')
.config(['$routeProvider', 'usSpinnerConfigProvider', function ($routeProvider, usSpinnerConfigProvider) {
    $routeProvider.when('/', {
        redirectTo: '/alerts'
    }).when('/alerts', {
        controller: 'AlertsCtrl',
        controllerAs: 'alertsCtrl',
        templateUrl: 'views/alerts.html'
    }).when('/contracts', {
        templateUrl: 'views/contracts.html',
        controller: 'ContractsCtrl',
        controllerAs: 'contractsCtrl'
    }).when('/orders', {
        controller: 'OrdersCtrl',
        controllerAs: 'ordersCtrl',
        templateUrl: 'views/orders.html'
    }).when('/executions', {
        controller: 'ExecutionsCtrl',
        controllerAs: 'executionsCtrl',
        templateUrl: 'views/executions.html'
    }).when('/bulletins', {
        controller: 'NewsBulletinsCtrl',
        controllerAs: 'newsBulletinsCtrl',
        templateUrl: 'views/bulletins.html'
    }).when('/loggers', {
        controller: 'LoggerCtrl',
        controllerAs: 'loggerCtrl',
        templateUrl: 'views/logger.html'
    }).when('/tradeengines', {
        controller: 'TradeEngineCtrl',
        controllerAs: 'tradeEngineCtrl',
        templateUrl: 'views/trade-engine.html'
    }).when('/systems', {
        controller: 'SystemsCtrl',
        controllerAs: 'systemsCtrl',
        templateUrl: 'views/systems.html'
    }).when('/strat/configs', {
        controller: 'StratConfigsCtrl',
        controllerAs: 'stratConfigsCtrl',
        templateUrl: 'views/strat-configs.html'
    }).when('/strat/datapoints', {
        controller: 'StratDatapointsCtrl',
        controllerAs: 'stratDatapointsCtrl',
        templateUrl: 'views/strat-datapoints.html'
    }).when('/strat/newcresus', {
        controller: 'StratNewCresusCtrl',
        controllerAs: 'stratNewCresusCtrl',
        templateUrl: 'views/strat-newcresus.html'
    }).when('/marketdata/graphs', {
        controller: 'GraphsCtrl',
        controllerAs: 'graphsCtrl',
        templateUrl: 'views/graphs.html'
    }).when('/marketdata/fxevents', {
        templateUrl: 'views/fxevents.html',
        controller: 'FxEventsCtrl',
        controllerAs: 'fxEventsCtrl'
    }).when('/marketdata/excel', {
        controller: 'MarketDataExcelCtrl',
        controllerAs: 'marketDataExcelCtrl',
        templateUrl: 'views/marketdata-excel.html'
    }).when('/strats', {
        templateUrl: 'views/strats.html',
        controller: 'StratsCtrl',
        controllerAs: 'stratsCtrl'
    }).when('/systems/logs', {
        controller: 'SystemsLogsCtrl',
        controllerAs: 'systemsLogsCtrl',
        templateUrl: 'views/systems-logs.html'
    }).when('/systems/systems-service', {
        templateUrl: 'views/systems-service.html',
        controller: 'SystemsServiceCtrl',
        controllerAs: 'systemsServiceCtrl'
    }).when('/systems/converter-service', {
        templateUrl: 'views/converter-service.html',
        controller: 'ConverterServiceCtrl',
        controllerAs: 'converterServiceCtrl'
    }).when('/systems/service-control-service', {
      templateUrl: 'views/service-control-service.html',
      controller: 'ServiceControlServiceCtrl',
      controllerAs: 'serviceControlServiceCtrl'
    }).otherwise({
        redirectTo: '/'
    });

    usSpinnerConfigProvider.setDefaults({
        radius: 8,
        width: 2,
        length: 4
    });
}]);

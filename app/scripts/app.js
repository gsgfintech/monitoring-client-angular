'use strict';

angular.module('monitorApp', ['angularSpinner', 'SignalR', 'ui.bootstrap', 'ngAnimate', 'ngFileSaver', 'ngResource', 'ngRoute', 'ngSanitize',
    'toaster', 'ui.router', 'ui.bootstrap', 'uiSwitch'])
.constant('serverEnpoint', 'https://fxmonitor.gsg.capital:9098/')
.constant('marketDataServiceEnpoint', 'https://tryphon.gsg.capital:6581/')
.constant('systemsServiceEnpoint', 'https://tryphon.gsg.capital:6582/')
.config(['$stateProvider', '$urlRouterProvider', 'usSpinnerConfigProvider', function ($stateProvider, $urlRouterProvider, usSpinnerConfigProvider) {
    $stateProvider.state('home', {
        controller: 'AlertsCtrl',
        controllerAs: 'alertsCtrl',
        templateUrl: 'views/alerts.html',
        url: '/'
    }).state('contracts', {
        templateUrl: 'views/contracts.html',
        controller: 'ContractsCtrl',
        controllerAs: 'contractsCtrl',
        url: '/contracts'
    }).state('orders-day', {
        controller: 'OrdersCtrl',
        controllerAs: 'ordersCtrl',
        templateUrl: 'views/orders.html',
        url: '/orders/day/:date'
    }).state('orders-id', {
        controller: 'OrderDetailsCtrl',
        controllerAs: 'orderDetailsCtrl',
        templateUrl: 'views/order-details.html',
        url: '/orders/id/:id'
    }).state('executions-day', {
        controller: 'ExecutionsCtrl',
        controllerAs: 'executionsCtrl',
        templateUrl: 'views/executions.html',
        url: '/executions/day/:date'
    }).state('executions-id', {
        controller: 'ExecutionDetailsCtrl',
        controllerAs: 'executionDetailsCtrl',
        templateUrl: 'views/execution-details.html',
        url: '/executions/id/:id'
    }).state('bulletins', {
        controller: 'NewsBulletinsCtrl',
        controllerAs: 'newsBulletinsCtrl',
        templateUrl: 'views/bulletins.html',
        url: '/bulletins'
    }).state('systems', {
        controller: 'SystemsCtrl',
        controllerAs: 'systemsCtrl',
        templateUrl: 'views/systems.html'
    }).state('systems-loggers', {
        controller: 'LoggerCtrl',
        controllerAs: 'loggerCtrl',
        templateUrl: 'views/logger.html',
        url: '/sytems/loggers'
    }).state('systems-trade-engines', {
        controller: 'TradeEngineCtrl',
        controllerAs: 'tradeEngineCtrl',
        templateUrl: 'views/trade-engine.html',
        url: '/systems/trade-engines'
    }).state('marketdata-graphs', {
        controller: 'GraphsCtrl',
        controllerAs: 'graphsCtrl',
        templateUrl: 'views/graphs.html',
        url: '/marketdata/graphs/:cross'
    }).state('marketdata-fxevents', {
        templateUrl: 'views/fxevents.html',
        controller: 'FxEventsCtrl',
        controllerAs: 'fxEventsCtrl',
        url: '/marketdata/fxevents'
    }).state('marketdata-excel', {
        controller: 'MarketDataExcelCtrl',
        controllerAs: 'marketDataExcelCtrl',
        templateUrl: 'views/marketdata-excel.html',
        url: '/marketdata/excel'
    }).state('strats', {
        templateUrl: 'views/strats.html',
        controller: 'StratsCtrl',
        controllerAs: 'stratsCtrl',
        url: '/strats'
    }).state('strat-configs', {
        controller: 'StratConfigsCtrl',
        controllerAs: 'stratConfigsCtrl',
        templateUrl: 'views/strat-configs.html',
        url: '/strat/configs'
    }).state('strat-datapoints', {
        controller: 'StratDatapointsCtrl',
        controllerAs: 'stratDatapointsCtrl',
        templateUrl: 'views/strat-datapoints.html',
        url: '/strat/datapoints'
    }).state('strat-newcresus', {
        controller: 'StratNewCresusCtrl',
        controllerAs: 'stratNewCresusCtrl',
        templateUrl: 'views/strat-newcresus.html',
        url: '/strat/newcresus'
    }).state('strat-stratedge', {
        controller: 'StratStratedgeCtrl',
        controllerAs: 'stratStratedgeCtrl',
        templateUrl: 'views/strat-stratedge.html',
        url: '/strat/stratedge'
    }).state('system-status', {
        controller: 'SystemStatusDetailsCtrl',
        controllerAs: 'systemStatusDetailsCtrl',
        templateUrl: 'views/system-status-details.html',
        url: '/systems/:name'
    }).state('systems-logs', {
        controller: 'SystemsLogsCtrl',
        controllerAs: 'systemsLogsCtrl',
        templateUrl: 'views/systems-logs.html',
        url: '/systems/logs'
    }).state('systems-systems-service', {
        templateUrl: 'views/systems-service.html',
        controller: 'SystemsServiceCtrl',
        controllerAs: 'systemsServiceCtrl',
        url: '/systems/systems-service'
    }).state('systems-converter-service', {
        templateUrl: 'views/converter-service.html',
        controller: 'ConverterServiceCtrl',
        controllerAs: 'converterServiceCtrl',
        url: '/systems/converter-service'
    }).state('systems-service-control-service', {
        templateUrl: 'views/service-control-service.html',
        controller: 'ServiceControlServiceCtrl',
        controllerAs: 'serviceControlServiceCtrl',
        url: '/systems/service-control-service'
    });
    
    $urlRouterProvider.otherwise('/');

    usSpinnerConfigProvider.setDefaults({
        radius: 8,
        width: 2,
        length: 4
    });
}]);

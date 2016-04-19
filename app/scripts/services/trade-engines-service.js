'use strict';

angular.module('monitorApp')
.factory('TradeEnginesService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/tradeengines/:engineName/:action/:cross';

    return $resource(address, {
            engineName: '@EngineName',
            action: '@Action',
            cross: '@Cross'
        });
}])
.factory('TradeEnginesService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/tradeengines/:engineName/:action/:cross';

    return $resource(address, {
        engineName: '@EngineName',
        action: '@Action',
        cross: '@Cross'
    });
}])
.factory('TradeEnginesStratsService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/tradeengines/:engineName/:action/:strategyName/:strategyVersion';

    return $resource(address, {
        engineName: '@EngineName',
        action: '@Action',
        strategyName: '@StrategyName',
        strategyVersion: '@StrategyVersion'
    });
}]);

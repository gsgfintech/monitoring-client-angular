'use strict';

angular.module('monitorApp')
.factory('MarketDataRangeService', ['$resource', 'marketDataServiceEnpoint', function ($resource, marketDataServiceEnpoint) {
    var address = marketDataServiceEnpoint + 'api/marketdata/range/:crosses/?start=:start&end=:end';

    return $resource(address, {
        crosses: 'crosses',
        start: 'start',
        end: 'end'
    });
}])
.factory('MarketDataLatestService', ['$resource', 'marketDataServiceEnpoint', function ($resource, marketDataServiceEnpoint) {
    var address = marketDataServiceEnpoint + 'api/marketdata/latest/:crosses';

    return $resource(address, {
        crosses: 'crosses'
    });
}]);

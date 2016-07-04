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
}])
.factory('MarketDataCrossesService', ['$resource', 'marketDataServiceEnpoint', function ($resource, marketDataServiceEnpoint) {
    var address = marketDataServiceEnpoint + 'api/marketdata/crosses';

    return $resource(address);
}])
.factory('MarketDataService', ['MarketDataCrossesService', function (MarketDataCrossesService) {

    var crossesInDb = null;

    function getListOfCrossesAvailable(successCb, errCb) {
        if (crossesInDb) {
            if (successCb) {
                successCb(crossesInDb);
            }
        } else {
            MarketDataCrossesService.query(function (crosses) {
                if (crosses) {
                    crossesInDb = crosses;

                    if (successCb) {
                        successCb(crossesInDb);
                    }
                } else {
                    if (errCb) {
                        errCb('No cross retrieved');
                    }
                }
            }, function (err) {
                console.error(err);

                if (errCb) {
                    errCb(err);
                }
            });
        }
    }

    return {
        getListOfCrossesAvailable: getListOfCrossesAvailable
    };
}]);

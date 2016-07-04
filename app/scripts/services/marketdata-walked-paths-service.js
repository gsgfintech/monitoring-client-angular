'use strict';

angular.module('monitorApp')
.factory('MarketDataWalkedPathsWebService', ['$resource', 'marketDataServiceEnpoint', function ($resource, marketDataServiceEnpoint) {
    var address = marketDataServiceEnpoint + 'api/walked-paths/?cross=:cross&lengthInMinutes:=lengthInMinutes&day=:day';

    return $resource(address, {
        cross: 'cross',
        lengthInMinutes: 'lengthInMinutes',
        day: 'day'
    });
}])
.factory('MarketDataWalkedPathsService', ['MarketDataWalkedPathsWebService', function (MarketDataWalkedPathsWebService) {

    function getWalkedPaths(cross, lengthInMinutes, day, successCb, errCb) {
        MarketDataWalkedPathsWebService.get({
            cross: cross,
            lengthInMinutes: lengthInMinutes,
            day: day.toUTCString()
        }, function (data) {
            if (data.Error) {
                errCb(data.Error);
            } else {
                successCb(data);
            }
        });
    }

    return {
        getWalkedPaths: getWalkedPaths
    };
}]);

'use strict';

angular.module('monitorApp')
.factory('FXEventsWeekService', ['$resource', 'marketDataServiceEnpoint', function ($resource, marketDataServiceEnpoint) {
    var address = marketDataServiceEnpoint + 'api/fxevents/week';

    return $resource(address);
}]);

'use strict';

angular.module('monitorApp')
.factory('FXEventsWeekService', ['$resource', 'marketDataServiceEnpoint', function ($resource, marketDataServiceEnpoint) {
    var address = marketDataServiceEnpoint + 'api/fxevents/week';

    return $resource(address);
}])
.factory('FXEventsTodayHighService', ['$resource', 'marketDataServiceEnpoint', function ($resource, marketDataServiceEnpoint) {
    var address = marketDataServiceEnpoint + 'api/fxevents/todayhigh';

    return $resource(address);
}]);

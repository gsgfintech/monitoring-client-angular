'use strict';

angular.module('monitorApp')
.factory('FXEventsWeekService', ['$resource', 'marketDataServiceEnpoint', function ($resource, marketDataServiceEnpoint) {
    var address = marketDataServiceEnpoint + 'api/fxevents/week';

    return $resource(address);
}])
.factory('FXEventsTodayHighService', ['$resource', 'marketDataServiceEnpoint', function ($resource, marketDataServiceEnpoint) {
    var address = marketDataServiceEnpoint + 'api/fxevents/todayhigh';

    return $resource(address);
}])
.factory('FXEventsByCrossForWebService', ['$resource', 'marketDataServiceEnpoint', function ($resource, marketDataServiceEnpoint) {
    var address = marketDataServiceEnpoint + 'api/fxevents/?cross=:cross&day=:day';

    return $resource(address, {
        cross: 'cross',
        day: 'day'
    });
}])
.factory('FXEventsService', ['FXEventsByCrossForWebService', function (FXEventsByCrossForWebService) {

    function getEventsByCrossAndDay(cross, day, keepTimeComponentOnly, successCb, errCb) {
        FXEventsByCrossForWebService.query({
            cross: cross,
            day: day.toUTCString(),
            keepTimeComponentOnly: keepTimeComponentOnly
        }, function (events) {
            successCb(events);
        }, function (err) {
            errCb(err);
        });
    }

    return {
        getEventsByCrossAndDay: getEventsByCrossAndDay
    };
}]);

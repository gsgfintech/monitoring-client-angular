'use strict';

angular.module('monitorApp')
.factory('FXEventsWeekService', ['$resource', 'serverEnpoint', function ($resource, serverEnpoint) {
    var address = serverEnpoint + 'api/fxevents/week';

    return $resource(address);
}])
.factory('FXEventsTodayHighService', ['$resource', 'serverEnpoint', function ($resource, serverEnpoint) {
    var address = serverEnpoint + 'api/fxevents/todayhigh';

    return $resource(address);
}])
.factory('FXEventsByCrossForWebService', ['$resource', 'serverEnpoint', function ($resource, serverEnpoint) {
    var address = serverEnpoint + 'api/fxevents/?cross=:cross&day=:day';

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

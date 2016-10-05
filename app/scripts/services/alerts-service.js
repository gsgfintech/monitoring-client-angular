'use strict';

angular.module('monitorApp')
.factory('AlertsCloseService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/alerts/close';

    return $resource(address, {
        ids: '@Ids'
    });
}])
.factory('AlertsOpenService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/alerts';

    return $resource(address);
}]).factory('AlertsClosedTodayService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/alerts/closedtoday';

    return $resource(address);
}]);

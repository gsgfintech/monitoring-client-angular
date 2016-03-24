'use strict';

angular.module('monitorApp')
.factory('AlertsCloseService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/alerts/close';

    return $resource(address, {
        ids: '@Ids'
    });
}]);

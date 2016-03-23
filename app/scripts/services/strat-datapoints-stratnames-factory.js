'use strict';

angular.module('monitorApp')
.factory('StratDatapointsStratnameService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/stratdatapointsstratnames';

    return $resource(address);
}]);
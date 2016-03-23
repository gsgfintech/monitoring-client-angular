'use strict';

angular.module('monitorApp')
.factory('SystemsLogsService', ['$resource', 'systemsServiceEnpoint', function ($resource, systemsServiceEnpoint) {
    var address = systemsServiceEnpoint + 'api/logs/';

    return $resource(address);
}])
.factory('SystemsLogsQueryService', ['$resource', 'systemsServiceEnpoint', function ($resource, systemsServiceEnpoint) {
    var address = systemsServiceEnpoint + 'api/logs/?system=:system&latestId=:latestId';

    return $resource(address);
}]);
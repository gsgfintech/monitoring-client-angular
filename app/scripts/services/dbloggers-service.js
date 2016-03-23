'use strict';

angular.module('monitorApp')
.factory('DBLoggersService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/dbloggers/:loggerName/:action';

    return $resource(address, {
        loggerName: '@LoggerName',
        action: '@Action'
    });
}]);

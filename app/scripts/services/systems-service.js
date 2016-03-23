'use strict';

angular.module('monitorApp')
.factory('SystemsService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/systems/:systemName/:action';

    return $resource(address, {
        systemName: '@SystemName',
        action: '@Action'
    });
}]);

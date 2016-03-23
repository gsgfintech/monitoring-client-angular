'use strict';

angular.module('monitorApp')
.factory('StratConfigsService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/stratconfigs/:id';

    return $resource(address, { id: '@_id' });
}]);
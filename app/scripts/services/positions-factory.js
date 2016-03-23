'use strict';

angular.module('monitorApp')
.factory('PositionsService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/positionsweb/:id';

    return $resource(address, {
        'id': '@_id'
    });
}]);

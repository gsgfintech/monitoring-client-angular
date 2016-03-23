'use strict';

angular.module('monitorApp')
.factory('ContractsService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/contracts/:id';

    return $resource(address, {
            id: '@Id'
        },
        {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        });
}]);

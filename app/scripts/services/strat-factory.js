'use strict';

angular.module('monitorApp')
.factory('StratService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/strats/:name/:version';

    return $resource(address, {
        name: '@Name',
        version: '@Version'
    },
        {
            update: {
                method: 'PUT' // this method issues a PUT request
            }
        });
}]);

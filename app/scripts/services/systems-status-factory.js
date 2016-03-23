'use strict';

angular.module('monitorApp')
.factory('SystemsStatusService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/systemsstatusweb/:systemName';

    return $resource(address);
}])
.factory('SystemsStatusAckService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/systemsstatusweb/:systemName/:attributeName/ack/:ackUntil';

    return $resource(address);
}])
.factory('SystemsStatusUnackService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/systemsstatusweb/:systemName/:attributeName/unack';

    return $resource(address);
}]);
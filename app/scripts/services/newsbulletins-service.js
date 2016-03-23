'use strict';

angular.module('monitorApp')
.factory('NewsBulletinsService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/newsbulletins/:id';

    return $resource(address, {
        id: '@_id'
    });
}])
.factory('NewsBulletinsByStatusService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/newsbulletins/status/:status';

    return $resource(address, {
        status: '@Status'
    });
}])
.factory('NewsBulletinsClosedTodayService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/newsbulletins/closedtoday';

    return $resource(address);
}])
.factory('NewsBulletinsCloseService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/newsbulletins/close/:id';

    return $resource(address, {
        id: '@_id'
    });
}]);

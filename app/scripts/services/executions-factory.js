'use strict';

angular.module('monitorApp')
.factory('ExecutionsService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/executionsweb/?day=:day';

    return $resource(address, {
        day: 'day'
    });
}])
.factory('ExecutionDetailsService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/executionsweb/?id=:id';

    return $resource(address, {
        id: 'id'
    });
}])
.factory('ExecutionsExcelService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/executionsexcel/?day=:day';

    function getFileNameFromHeader(header) {
        if (!header) {
            return null;
        }

        var result = header.split(';')[1].trim().split('=')[1];

        return result.replace(/"/g, '');
    }

    return $resource(address, {
        day: 'day'
    },
    // Custom method for file download
    {
        download: {
            method: 'GET',
            url: address,
            headers: {
                accept: 'application/octet-stream'
            },
            responseType: 'arraybuffer',
            cache: false,
            transformResponse: function (data, headers) {
                var file = null;
                if (data) {
                    file = new Blob([data], {
                        type: 'application/octet-stream'
                    });
                }

                var filename = getFileNameFromHeader(headers('content-disposition'));

                var result = {
                    blob: file,
                    filename: filename
                };

                return {
                    response: result
                };
            }
        }
    });
}])
.factory('TradesService', ['$rootScope', function ($rootScope) {

    var netPnl = 0;

    function getNetPnl() {
        return netPnl;
    }

    function setNetPnl(value) {
        netPnl = value.toFixed(0);

        $rootScope.$broadcast('tradesService.netPnlUpdated', { netPnl: netPnl });
    }

    return {
        getNetPnl: getNetPnl,
        setNetPnl: setNetPnl
    };

}]);
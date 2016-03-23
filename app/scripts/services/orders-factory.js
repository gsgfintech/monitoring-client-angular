'use strict';

angular.module('monitorApp')
.factory('OrdersService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/ordersweb/?day=:day';

    return $resource(address, {
        day: 'day'
    });
}])
.factory('OrderDetailsService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/ordersweb/?id=:id';

    return $resource(address, {
        id: 'id'
    });
}])
.factory('OrdersExcelService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/ordersexcel/?day=:day';

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
            transformResponse: function(data, headers) {
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
}]);
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
.factory('TradesService', [function () {

    function formatRate(cross, rate) {
        if (!rate) {
            return null;
        } else if (cross.indexOf('JPY') > -1) {
            return rate.toFixed(3);
        } else {
            return rate.toFixed(5);
        }
    }

    function shortenCross(cross) {
        return cross.replace('USD', '').replace('/', '');
    }

    function shortenOrigin(origin) {
        if (origin === 'PositionOpen') {
            return 'PO';
        } else if (origin === 'PositionClose') {
            return 'PC';
        } else if (origin === 'PositionClose_ContStop') {
            return 'PCS';
        } else if (origin === 'PositionClose_ContLimit') {
            return 'PCL';
        } else if (origin === 'PositionClose_TE') {
            return 'PCT';
        } else if (origin === 'PositionClose_CircuitBreaker') {
            return 'PCB';
        } else if (origin === 'PositionReverse_Close') {
            return 'PRC';
        } else if (origin === 'PositionReverse_Open') {
            return 'PRO';
        } else {
            return origin;
        }
    }

    function shortenSide(side) {
        return side.substring(0, 1);
    }

    return {
        formatRate: formatRate,
        shortenCross: shortenCross,
        shortenOrigin: shortenOrigin,
        shortenSide: shortenSide
    };

}]);
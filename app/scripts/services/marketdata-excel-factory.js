'use strict';

angular.module('monitorApp')
.factory('MarketDataExcelCrossesService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/marketdataexcel/';

    return $resource(address);
}])
.factory('MarketDataExcelQueryService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/marketdataexcel/?cross=:cross&lowerBound=:lowerBound&upperBound=:upperBound';

    return $resource(address);
}])
.factory('MarketDataExcelExportService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/marketdataexcel/?cross=:cross&lowerBound=:lowerBound&upperBound=:upperBound&isExcel=true';

    function getFileNameFromHeader(header) {
        if (!header) {
            return null;
        }

        var result = header.split(';')[1].trim().split('=')[1];

        return result.replace(/"/g, '');
    }

    return $resource(address, {
        cross: 'cross',
        lowerBound: 'lowerBound',
        upperBound: 'upperBound'
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
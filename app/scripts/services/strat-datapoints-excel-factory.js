'use strict';

angular.module('monitorApp')
.factory('StratDatapointsExcelService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/stratdatapointsexcel/:stratname/:cross/?lowerBound=:lowerBound&upperBound=:upperBound';

    function getFileNameFromHeader(header) {
        if (!header) {
            return null;
        }

        var result = header.split(';')[1].trim().split('=')[1];

        return result.replace(/"/g, '');
    }

    return $resource(address, {
        stratname: 'stratname',
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
                if (!data || data.byteLength === 0) {
                    return {
                        error: 'The query returned no result'
                    };
                } else {
                    file = new Blob([data], {
                        type: 'application/octet-stream'
                    });

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
        }
    });
}])
.factory('StratDatapointsTradedExcelService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/stratdatapointsexcel/:stratname/:cross/traded/?lowerBound=:lowerBound&upperBound=:upperBound';

    function getFileNameFromHeader(header) {
        if (!header) {
            return null;
        }

        var result = header.split(';')[1].trim().split('=')[1];

        return result.replace(/"/g, '');
    }

    return $resource(address, {
        stratname: 'stratname',
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
                if (!data || data.byteLength === 0) {
                    return {
                        error: 'The query returned no result'
                    };
                } else {
                    file = new Blob([data], {
                        type: 'application/octet-stream'
                    });

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
        }
    });
}])
.factory('StratDatapointsLatestExcelService', ['$resource', 'serverEnpoint', function ($resource, serverEndpoint) {
    var address = serverEndpoint + 'api/stratdatapointsexcel/:stratname/:cross/latest/';

    function getFileNameFromHeader(header) {
        if (!header) {
            return null;
        }

        var result = header.split(';')[1].trim().split('=')[1];

        return result.replace(/"/g, '');
    }

    return $resource(address, {
        stratname: 'stratname',
        cross: 'cross'
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

                if (!data || data.byteLength === 0) {
                    return {
                        error: 'The query returned no result'
                    };
                } else {
                    file = new Blob([data], {
                        type: 'application/octet-stream'
                    });

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
        }
    });
}]);
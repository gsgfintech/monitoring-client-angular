(function () {
    'use strict';

    var app = angular.module('monitorApp');

    app.factory('FXPairsService', ['$resource', 'serverEnpoint', function ($resource, serverEnpoint) {

        var address = serverEnpoint + 'api/fxpairs';

        var fxPairsService = $resource(address);

        var fxPairs = null;

        function loadPairs(cb) {
            if (fxPairs && fxPairs.length > 0) {
                cb(fxPairs);
            } else {
                fxPairsService.query(function (pairs) {
                    fxPairs = pairs;
                    cb(fxPairs);
                });
            }
        }

        function listAll(cb) {
            loadPairs(function (pairs) {
                cb(pairs);
            });
        }

        function convertFromIntCode(intCode) {
            for (var i = 0; i < fxPairs.length; i++) {
                if (fxPairs[i].IntCode === intCode) {
                    return fxPairs[i].Pair;
                }
            }

            return 'UNKNOWN';
        }

        return {
            convertFromIntCode: convertFromIntCode,
            listAll: listAll
        };
    }]);
})();

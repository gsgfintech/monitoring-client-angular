'use strict';

angular.module('monitorApp')
.controller('GraphsCtrl', ['$cacheFactory', '$location', '$rootScope', '$stateParams', 'serverEnpoint', 'marketDataServiceEnpoint', 'MarketDataCrossesService', function ($cacheFactory, $location, $rootScope, $stateParams, serverEnpoint, marketDataServiceEnpoint, MarketDataCrossesService) {

    var self = this;

    function getCrossIndex(cross) {
        for (var i = 0; i < self.crosses.length; i++) {
            if (self.crosses[i] === cross) {
                return i;
            }
        }

        return -1;
    }

    function validateCrossAndRenderChart() {
        if ($stateParams.cross) {
            var cross = $stateParams.cross.toUpperCase();

            var index = getCrossIndex(cross);

            var thisMorning = new Date();
            thisMorning.setHours(5, 0, 0, 0);

            var since5pm = new Date() - thisMorning; // in ms
            since5pm = Math.round(since5pm / 1000 / 60); // in minutes

            if (index > -1) {
                self.cross = cross;

                var graphParams = {
                    cross: self.cross,
                    duration: since5pm, // in minutes
                    marketDataEndpoint: marketDataServiceEnpoint,
                    tradesEndpoint: serverEnpoint
                };

                $rootScope.$broadcast('amStockCharts.canRender', graphParams);
            }
        }
    }

    var cache = $cacheFactory.get('graphsCtrl') || $cacheFactory('graphsCtrl');

    self.cross = null;
    self.crosses = cache.get('graphsCtrl.crosses');

    if (!self.crosses) {
        MarketDataCrossesService.query(function (crosses) {
            self.crosses = [];

            for (var i = 0; i < crosses.length; i++) {
                self.crosses.push(crosses[i].toUpperCase());
            }

            cache.put('graphsCtrl.crosses', self.crosses);

            validateCrossAndRenderChart();
        });
    } else {
        validateCrossAndRenderChart();
    }

    self.pickCross = function () {
        console.log('New cross:', self.cross);

        // Update path in address bar. That will trigger the graph rendering
        $location.path('/marketdata/graphs/' + self.cross);
    };

}]);
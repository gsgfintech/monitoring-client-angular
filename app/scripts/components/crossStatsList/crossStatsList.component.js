(function () {
    'use strict';

    var app = angular.module('monitorApp');

    app.component('crossStatsList', {
        bindings: {

        },
        templateUrl: '/scripts/components/crossStatsList/crossStatsList.component.html',
        controller: ['$rootScope', function ($rootScope) {

            var self = this;

            self.pairs = [];

            function findPairIndex(pair) {
                for (var i = 0; i < self.pairs.length; i++) {
                    if (self.pairs[i].pair === pair) {
                        return i;
                    }
                }

                return -1;
            }

            // Event handlers
            $rootScope.$on('fxPairsStatsUpdatedEvent', function (event, stats) {
                if (stats) {
                    for (var i = 0; i < stats.length; i++) {
                        if (stats[i].DayStats) {
                            var index = findPairIndex(stats[i].Pair);

                            if (index > -1) {
                                self.pairs[index].priceTicks = stats[i].DayStats.PriceTicks;
                                self.pairs[index].sizeTicks = stats[i].DayStats.SizeTicks;
                                self.pairs[index].rtBars = stats[i].DayStats.RTBars;
                            } else {
                                self.pairs.push({
                                    pair: stats[i].Pair,
                                    dbLogger: stats[i].DayStats.DBLogger,
                                    priceTicks: stats[i].DayStats.PriceTicks,
                                    sizeTicks: stats[i].DayStats.SizeTicks,
                                    rtBars: stats[i].DayStats.RTBars
                                });
                            }
                        }
                    }

                    $rootScope.$apply();
                }
            });
        }]
    });
})();
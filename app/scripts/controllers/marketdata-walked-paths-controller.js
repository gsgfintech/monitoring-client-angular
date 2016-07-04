'use strict';

angular.module('monitorApp')
.controller('MarketDataWalkedPathsCtrl', ['$q', '$rootScope', 'FXEventsService', 'MarketDataService', 'MarketDataWalkedPathsService', function ($q, $rootScope, FXEventsService, MarketDataService, MarketDataWalkedPathsService) {

    var self = this;

    self.crosses = [];
    self.graphRendered = true;
    self.formAccordionOpen = true;

    self.lengthInMinutes = 90;
    self.params = [{
        cross: null,
        day: null
    }];

    MarketDataService.getListOfCrossesAvailable(function (crosses) {
        self.crosses = crosses;
    });

    var dataSets = null;

    function getWalkedPathsData(param) {
        return $q(function (resolve, reject) {
            // 1. Load walked paths
            MarketDataWalkedPathsService.getWalkedPaths(param.cross, self.lengthInMinutes, param.day, function (data) { // Success
                console.log('Loaded walked paths for', param.cross, param.day);
                var set = {
                    cross: param.cross,
                    day: param.day,
                    bids: data.BidsWalkedPaths,
                    asks: data.AsksWalkedPaths
                };

                FXEventsService.getEventsByCrossAndDay(param.cross, param.day, true, function (events) { // Success
                    set.events = events;
                    dataSets.sets.push(set);
                    resolve();
                }, function (eventsErr) {
                    console.error(eventsErr);
                    dataSets.sets.push(set);
                    resolve();
                });
            }, function (err) { // Error
                console.error(err);
                reject();
            });
        });
    }

    self.renderGraph = function () {
        dataSets = {
            sets: []
        };

        self.graphRendered = false;

        var cleanedParams = [];
        for (var i = 0; i < self.params.length; i++) {
            if (self.params[i].cross && self.params[i].day) {
                cleanedParams.push(angular.copy(self.params[i]));
            }
        }

        var promises = [];

        for (var j = 0; j < cleanedParams.length; j++) {
            promises.push(getWalkedPathsData(cleanedParams[j]));
        }

        $q.all(promises).then(function () {
            console.log('All data loaded. Will trigger graph rendering');

            self.showGraph = true;

            $rootScope.$broadcast('walkedPathChart.canRender', dataSets);
        });
    };

    self.addParamRow = function () {
        self.params.push({
            cross: null,
            day: null
        });
    };

    self.removeParamRow = function () {
        self.params.pop();
    };

    // Event handlers
    $rootScope.$on('walkedPathChart.rendered', function () {
        self.graphRendered = true;
        self.formAccordionOpen = false;
    });

}]);

'use strict';

angular.module('monitorApp')
.controller('StratStratedgeCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {

    var self = this;

    self.datapoints = [];

    function getDatapoint(stratName, cross) {
        for (var i = 0; i < self.datapoints.length; i++) {
            if (self.datapoints[i].Strategy === stratName && self.datapoints[i].Cross === cross) {
                return i;
            }
        }

        return -1;
    }

    // Event listeners
    $rootScope.$on('newAlgoDataPointReceivedEvent', function (event, args) {
        var dataPoint = args.dataPoint;

        if (dataPoint.StrategyName.substring('Open_Stratedge') < 0) {
            return; // ignore irrelevant datapoints
        }

        var existingIndex = getDatapoint(dataPoint.Strategy, dataPoint.Cross);

        if (existingIndex > -1) { // Update existing
            self.datapoints[existingIndex].CloseFlag1 = dataPoint.CloseFlag1;
            self.datapoints[existingIndex].CloseFlag2 = dataPoint.CloseFlag2;
            self.datapoints[existingIndex].CloseFlag3 = dataPoint.CloseFlag3;
            self.datapoints[existingIndex].CloseFlag4 = dataPoint.CloseFlag4;
            self.datapoints[existingIndex].CloseFlag5 = dataPoint.CloseFlag5;
            self.datapoints[existingIndex].CloseMetric1 = dataPoint.CloseMetric1;
            self.datapoints[existingIndex].CloseMetric2 = dataPoint.CloseMetric2;
            self.datapoints[existingIndex].LastWalkedPath = dataPoint.LastWalkedPath;
            self.datapoints[existingIndex].LimitLevel = dataPoint.LimitLevel;
            self.datapoints[existingIndex].StopLevel = dataPoint.StopLevel;
            self.datapoints[existingIndex].UnrealizedPnl = dataPoint.UnrealizedPnl;
            self.datapoints[existingIndex].UnrealizedPnlAvg = dataPoint.UnrealizedPnlAvg;
            self.datapoints[existingIndex].UnrealizedPnlMax = dataPoint.UnrealizedPnlMax;
            self.datapoints[existingIndex].UnrealizedPnlMin = dataPoint.UnrealizedPnlMin;
            self.datapoints[existingIndex].UnrealizedPnlStdDev = dataPoint.UnrealizedPnlStdDev;

            self.datapoints[existingIndex].Cross = dataPoint.Cross;
            self.datapoints[existingIndex].StrategyName = dataPoint.StrategyName;
            self.datapoints[existingIndex].Timestamp = dataPoint.Timestamp;
        } else { // Add new
            self.datapoints.push(dataPoint);
        }

        $scope.$apply();
    });

}]);

'use strict';

angular.module('monitorApp')
.controller('SystemsLogsCtrl', ['$scope', '$interval', 'SystemsLogsService', 'SystemsLogsQueryService', function ($scope, $interval, SystemsLogsService, SystemsLogsQueryService) {

    var self = this;

    self.loading = false;
    self.isPaused = false;

    self.latestId = '';

    self.systemNames = SystemsLogsService.query();
    self.systemName = null;

    self.logEntries = null;
    self.logEntriesCount = 0;

    var loadingTask = null;

    self.startLoadData = function () {
        if (self.loading === true) {
            self.stopLoadData();
        }

        self.loading = true;

        // 1. Initial load
        loadData();

        // 2. Subsequent loads, on timer
        loadingTask = $interval(loadData, 4000);
    };

    self.pauseLoadData = function () {
        if (loadingTask) {
            self.isPaused = true;
            console.log('Pausing polling of logs for', self.systemName);
            $interval.cancel(loadingTask);
        }
    };

    self.resumeLoadData = function () {
        // 1. Initial load
        loadData();

        // 2. Subsequent loads, on timer
        loadingTask = $interval(loadData, 4000);

        self.isPaused = false;
    };

    self.stopLoadData = function () {
        if (loadingTask) {
            console.log('Stopping polling of logs for', self.systemName);
            $interval.cancel(loadingTask);
        }

        self.latestId = '';
        self.logEntries = null;
        self.logEntriesCount = 0;

        self.loading = false;
    };

    function loadData() {
        console.log('Loading log entries for', self.systemName, 'from', self.latestId);

        SystemsLogsQueryService.get({
            system: self.systemName,
            latestId: self.latestId
        }, function (result) {
            console.log('Loaded', result.count, 'log entries');

            if (result.logEntries) {
                if (self.logEntries) {
                    for (var i = result.logEntries.length - 1; i >= 0; i--) {
                        self.logEntries.unshift(result.logEntries[i]);
                    }
                } else {
                    self.logEntries = result.logEntries;
                }

                if (self.logEntries.length > 1000) {
                    self.logEntries.splice(1000, self.logEntries.length - 1000);
                }
            }

            self.logEntriesCount += result.count;

            if (result.latestId) {
                self.latestId = result.latestId;
            }
        });
    }

    $scope.$on('$destroy', function () {
        self.stopLoadData();
    });
}]);
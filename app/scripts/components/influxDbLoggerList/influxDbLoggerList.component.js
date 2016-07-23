(function () {
    'use strict';

    var app = angular.module('monitorApp');

    app.component('influxDbLoggerList', {
        bindings: {

        },
        templateUrl: '/scripts/components/influxDbLoggerList/influxDbLoggerList.component.html',
        controller: ['FXPairsService', 'PopupService', 'SystemsConfigsQueryByTypeService', 'SystemsService', function (FXPairsService, PopupService, SystemsConfigsQueryByTypeService, SystemsService) {

            var self = this;

            var allPairs = [];
            self.assignedPairs = {};
            self.unassignedPairs = [];

            self.loggers = [];

            function getPair(intCode) {
                for (var i = 0; i < allPairs.length; i++) {
                    if (allPairs[i].code === intCode) {
                        return allPairs[i];
                    }
                }

                return null;
            }

            self.getPairsForLogger = function (loggerName) {
                var pairsForLogger = [];

                for (var i = 0; i < allPairs.length; i++) {
                    if (allPairs[i].loggers.indexOf(loggerName) > -1) {
                        pairsForLogger.push({
                            pair: allPairs[i].pair,
                            level: allPairs[i].loggers.length == 1 ? 'default' : 'danger'
                        });
                    }
                }

                return pairsForLogger;
            };

            FXPairsService.listAll(function (pairs) {
                allPairs = pairs.map(function (p) {
                    return {
                        pair: p.Pair,
                        code: p.IntCode,
                        loggers: []
                    };
                });

                SystemsConfigsQueryByTypeService.query({ type: 'InfluxDBLogger' }, function (loggers) {
                    for (var i = 0; i < loggers.length; i++) {
                        for (var j = 0; j < loggers[i].Pairs.length; j++) {
                            var pair = getPair(loggers[i].Pairs[j]);

                            if (pair) {
                                pair.loggers.push(loggers[i].Name);
                            }
                        }
                    }

                    self.unassignedPairs = allPairs.filter(function (p) { return p.loggers.length == 0 });

                    for (var i = 0; i < loggers.length; i++) {
                        loggers[i].Pairs = [];

                        for (var j = 0; j < allPairs.length; j++) {
                            if (allPairs[j].loggers.indexOf(loggers[i].Name) > -1) {
                                loggers[i].Pairs.push({
                                    pair: allPairs[j].pair,
                                    level: allPairs[j].loggers.length == 1 ? 'default' : 'danger'
                                });
                            }
                        }
                    }

                    self.loggers = loggers;
                });
            });

            this.start = function (loggerName) {
                console.log('Requesting to start', loggerName);

                SystemsService.get({
                    systemName: loggerName,
                    action: 'start'
                }, function (result) {
                    if (result.Success) {
                        var successMsg = 'Successfully started' + loggerName;
                        console.log(successMsg);
                        PopupService.showSuccess('Start', successMsg);
                    } else {
                        var errMsg = 'Failed to start' + loggerName + ':' + result.Message;
                        console.error(errMsg);
                        PopupService.showError('Start', errMsg);
                    }
                });
            };

            this.stop = function (loggerName) {
                console.log('Requesting to stop', loggerName);

                SystemsService.get({
                    systemName: loggerName,
                    action: 'stop'
                }, function (result) {
                    if (result.Success) {
                        var successMsg = 'Successfully stopped' + loggerName;
                        console.log(successMsg);
                        PopupService.showSuccess('Stop', successMsg);
                    } else {
                        var errMsg = 'Failed to stop' + loggerName + ':' + result.Message;
                        console.error(errMsg);
                        PopupService.showError('Stop', errMsg);
                    }
                });
            };

            this.restart = function (loggerName) {
                console.log('Requesting to restart', loggerName);

                SystemsService.get({
                    systemName: loggerName,
                    action: 'restart'
                }, function (result) {
                    if (result.Success) {
                        var successMsg = 'Successfully restarted' + loggerName;
                        console.log(successMsg);
                        PopupService.showSuccess('Restart', successMsg);
                    } else {
                        var errMsg = 'Failed to restart' + loggerName + ':' + result.Message;
                        console.error(errMsg);
                        PopupService.showError('Restart', errMsg);
                    }
                });
            };
        }]
    });
})();
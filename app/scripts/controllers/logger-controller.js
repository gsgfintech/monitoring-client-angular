'use strict';

angular.module('monitorApp')
.controller('LoggerCtrl', ['$scope', '$rootScope', '$uibModal', 'MonitoringAppService', 'ContractsService', 'DBLoggersService', 'SystemsService', 'SystemsConfigsService', 'PopupService', function ($scope, $rootScope, $uibModal, MonitoringAppService, ContractsService, DBLoggersService, SystemsService, SystemsConfigsService, PopupService) {

    var self = this;

    self.settingsEditedIndex = -1;

    self.loggers = [];

    function loadLoggersConfigs() {
        SystemsConfigsService.query(function (configs) {
            if (configs) {
                self.loggers.splice(0, self.loggers.length);

                for (var i = 0; i < configs.length; i++) {
                    if (configs[i].SystemType === 'DBLogger') {
                        self.loggers.push(configs[i]);
                    }
                }
            }
        });
    }

    loadLoggersConfigs();

    self.contracts = [];

    ContractsService.query(function (contracts) {
        if (contracts) {
            self.contracts.splice(0, self.contracts.length);

            for (var i = 0; i < contracts.length; i++) {
                self.contracts.push(contracts[i]);
            }
        }
    });

    self.focusedCross = null;
    self.focusedCrossEdit = false;

    self.startLogger = function (loggerName) {
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

    self.stopLogger = function (loggerName) {
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

    self.restartLogger = function (loggerName) {
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

    self.reloadPairs = function (loggerName) {
        DBLoggersService.get({
            loggerName: loggerName,
            action: 'reloadpairs'
        }, function (result) {
            if (result.Success) {
                var successMsg = 'Successfully reloaded pairs for' + loggerName;
                console.log(successMsg);
                PopupService.showSuccess('Reload pairs', successMsg);
            } else {
                var errMsg = 'Failed to reload pairs for ' + loggerName + ':' + result.Message;
                console.error(errMsg);
                PopupService.showError('Reload pairs', errMsg);
            }
        });
    };

    self.subscribeMdTicks = function (loggerName) {
        DBLoggersService.get({
            loggerName: loggerName,
            action: 'subscribemdticks'
        }, function (result) {
            if (result.Success) {
                var successMsg = 'Successfully subscribed MD ticks for' + loggerName;
                console.log(successMsg);
                PopupService.showSuccess('Subscribe MD ticks', successMsg);
            } else {
                var errMsg = 'Failed to subscribe MD ticks for ' + loggerName + ':' + result.Message;
                console.error(errMsg);
                PopupService.showError('Subscribe MD ticks', errMsg);
            }
        });
    };

    self.unsubscribeMdTicks = function (loggerName) {
        DBLoggersService.get({
            loggerName: loggerName,
            action: 'unsubscribemdticks'
        }, function (result) {
            if (result.Success) {
                var successMsg = 'Successfully unsubscribed MD ticks for' + loggerName;
                console.log(successMsg);
                PopupService.showSuccess('Unsubscribe MD ticks', successMsg);
            } else {
                var errMsg = 'Failed to unsubscribe MD ticks for ' + loggerName + ':' + result.Message;
                console.error(errMsg);
                PopupService.showError('Unsubscribe MD ticks', errMsg);
            }
        });
    };

    self.subscribeRtBars = function (loggerName) {
        DBLoggersService.get({
            loggerName: loggerName,
            action: 'subscribertbars'
        }, function (result) {
            if (result.Success) {
                var successMsg = 'Successfully subscribed RT bars for' + loggerName;
                console.log(successMsg);
                PopupService.showSuccess('Subscribe RT bars', successMsg);
            } else {
                var errMsg = 'Failed to subscribe RT bars for ' + loggerName + ':' + result.Message;
                console.error(errMsg);
                PopupService.showError('Subscribe RT bars', errMsg);
            }
        });
    };

    self.unsubscribeRtBars = function (loggerName) {
        DBLoggersService.get({
            loggerName: loggerName,
            action: 'unsubscribertbars'
        }, function (result) {
            if (result.Success) {
                var successMsg = 'Successfully unsubscribed RT bars for' + loggerName;
                console.log(successMsg);
                PopupService.showSuccess('Unsubscribe RT bars', successMsg);
            } else {
                var errMsg = 'Failed to unsubscribe RT bars for ' + loggerName + ':' + result.Message;
                console.error(errMsg);
                PopupService.showError('Unsubscribe RT bars', errMsg);
            }
        });
    };

    self.editConfig = function (config) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/logger-edit.html',
            controller: 'LoggerEditCtrl',
            controllerAs: 'loggerEditCtrl',
            size: 'lg',
            resolve: {
                config: function () {
                    return angular.copy(config);
                }
            }
        });

        modalInstance.result.then(function (updatedConfig) {
            updatedConfig.$update(function (updated) {
                console.log(updated.status);

                loadLoggersConfigs();
            });
        });
    };

    self.saveEditFocusedCross = function () {
        if (self.focusedCross.DBLoggerName === '') {
            self.focusedCross.DBLoggerName = null;
        }

        MonitoringAppService.saveCrossEdits(self.focusedCross);

        self.focusedCrossEdit = false;
    };

    self.cancelEditFocusedCross = function () {

        // TODO

        self.focusedCrossEdit = false;
    };

    // Event listeners

    $rootScope.$on('MonitoringAppService.loggersMustReloadPairsEvent', function (event, args) {
        var dbLoggerNames = args.dbLoggerNames;

        dbLoggerNames.forEach(function (dbLoggerName) {
            MonitoringAppService.requestReloadPairs(dbLoggerName);
        });
    });

}]);
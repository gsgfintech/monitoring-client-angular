'use strict';

angular.module('monitorApp')
.controller('TradeEngineCtrl', ['$scope', '$rootScope', '$interval', '$uibModal', 'PopupService', 'SystemsConfigsQueryByTypeService', 'SystemsConfigsService', 'SystemsStatusService', 'StratService', 'TradeEnginesService', 'TradeEnginesStratsService', 'SystemsService', function ($scope, $rootScope, $interval, $uibModal, PopupService, SystemsConfigsQueryByTypeService, SystemsConfigsService, SystemsStatusService, StratService, TradeEnginesService, TradeEnginesStratsService, SystemsService) {

    var self = this;

    self.settingsEditedIndex = -1;

    self.validIds = [];

    self.tradeEngines = [];

    var statusTask = null;
    var statusRequested = false;

    function loadTradeEngineConfigs() {
        SystemsConfigsService.query(function (configs) {
            if (configs) {
                self.tradeEngines.splice(0, self.tradeEngines.length);

                for (var i = 0; i < configs.length; i++) {
                    if (configs[i].SystemType === 'TradeEngine') {
                        self.tradeEngines.push(configs[i]);
                    }
                }

                if (!statusRequested) {
                    statusRequested = true;

                    startRequestStatus();
                }
            }

            loadStrats();
        });
    }

    function loadStrats() {
        StratService.query(function (strats) {
            if (strats) {
                for (var i = 0; i < strats.length; i++) {
                    if (strats[i].Available) {
                        for (var j = 0; j < self.tradeEngines.length; j++) {
                            var stratIndex = findStratIndex(self.tradeEngines[j], strats[i].Name, strats[i].Version);

                            if (stratIndex < 0) { // New strat for this trade engine, need to add it
                                self.tradeEngines[j].Strats.push({
                                    Name: strats[i].Name,
                                    Version: strats[i].Version,
                                    Active: false
                                });
                            }
                        }
                    }
                }
            }
        });
    }

    function findStratIndex(tradeEngine, stratName, stratVersion) {
        for (var i = 0; i < tradeEngine.Strats.length; i++) {
            if (tradeEngine.Strats[i].Name === stratName && tradeEngine.Strats[i].Version === stratVersion) {
                return i;
            }
        }

        return -1;
    }

    loadTradeEngineConfigs();

    self.editConfig = function (config) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/trade-engine-edit.html',
            controller: 'TradeEngineEditCtrl',
            controllerAs: 'tradeEngineEditCtrl',
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

                loadTradeEngineConfigs();
            });
        });
    };

    self.startTradeEngine = function (engineName) {
        SystemsService.get({
            systemName: engineName,
            action: 'start'
        }, function (result) {
            if (result.Success) {
                var successMsg = 'Successfully started' + engineName;
                console.log(successMsg);
                PopupService.showSuccess('Start', successMsg);
            } else {
                var errMsg = 'Failed to start' + engineName + ':' + result.Message;
                console.error(errMsg);
                PopupService.showError('Start', errMsg);
            }
        });
    };

    self.stopTradeEngine = function (engineName) {
        SystemsService.get({
            systemName: engineName,
            action: 'stop'
        }, function (result) {
            if (result.Success) {
                var successMsg = 'Successfully stopped' + engineName;
                console.log(successMsg);
                PopupService.showSuccess('Stop', successMsg);
            } else {
                var errMsg = 'Failed to stop' + engineName + ':' + result.Message;
                console.error(errMsg);
                PopupService.showError('Stop', errMsg);
            }
        });
    };

    self.restartTradeEngine = function (engineName) {
        SystemsService.get({
            engineName: engineName,
            action: 'restart'
        }, function (result) {
            if (result.Success) {
                var successMsg = 'Successfully restarted' + engineName;
                console.log(successMsg);
                PopupService.showSuccess('Restart', successMsg);
            } else {
                var errMsg = 'Failed to restart' + engineName + ':' + result.Message;
                console.error(errMsg);
                PopupService.showError('Restart', errMsg);
            }
        });
    };

    self.startTradingTradeEngine = function (engineName) {
        TradeEnginesService.get({
            engineName: engineName,
            action: 'starttrading',
            cross: 'all'
        }, function (result) {
            if (result.Success) {
                var successMsg = 'Successfully started trading on' + engineName;
                console.log(successMsg);
                PopupService.showSuccess('Start Trading', successMsg);
            } else {
                var errMsg = 'Failed to start trading on' + engineName + ':' + result.Message;
                console.error(errMsg);
                PopupService.showError('Start Trading', errMsg);
            }
        });
    };

    self.stopTradingTradeEngine = function (engineName) {
        TradeEnginesService.get({
            engineName: engineName,
            action: 'stoptrading',
            cross: 'all'
        }, function (result) {
            if (result.Success) {
                var successMsg = 'Successfully stopped trading on' + engineName;
                console.log(successMsg);
                PopupService.showSuccess('Stop Trading', successMsg);
            } else {
                var errMsg = 'Failed to stop trading on' + engineName + ':' + result.Message;
                console.error(errMsg);
                PopupService.showError('Stop Trading', errMsg);
            }
        });
    };

    self.cancelAllOrders = function (engineName) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/trade-engine-cxl-orders-confirm.html',
            controller: 'TradeEngineCxlOrdersConfirmCtrl',
            controllerAs: 'tradeEngineCxlOrdersConfirmCtrl',
            resolve: {
                engineName: function () {
                    return engineName;
                }
            }
        });

        modalInstance.result.then(function () {
            TradeEnginesService.get({
                engineName: engineName,
                action: 'cancelorders',
                cross: 'all'
            }, function (result) {
                if (result.Success) {
                    var successMsg = 'Successfully cancelled orders on' + engineName;
                    console.log(successMsg);
                    PopupService.showSuccess('Cancel orders', successMsg);
                } else {
                    var errMsg = 'Failed to cancel orders on' + engineName + ':' + result.Message;
                    console.error(errMsg);
                    PopupService.showError('Cancel orders', errMsg);
                }
            });
        });
    };

    self.closeAllPositions = function (engineName) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/trade-engine-close-pos-confirm.html',
            controller: 'TradeEngineClosePosConfirmCtrl',
            controllerAs: 'tradeEngineClosePosConfirmCtrl',
            resolve: {
                engineName: function () {
                    return engineName;
                }
            }
        });

        modalInstance.result.then(function () {
            TradeEnginesService.get({
                engineName: engineName,
                action: 'closepositions',
                cross: 'all'
            }, function (result) {
                if (result.Success) {
                    var successMsg = 'Successfully closed positions on' + engineName;
                    console.log(successMsg);
                    PopupService.showSuccess('Close positions', successMsg);
                } else {
                    var errMsg = 'Failed to close positions on' + engineName + ': ' + result.Message;
                    console.error(errMsg);
                    PopupService.showError('Close positions', errMsg);
                }
            });
        });
    };

    self.toggleStrat = function (isNotActive, engineName, stratName, stratVersion) {
        if (!isNotActive) { // isNotActive : when we click the switch has already changed the value of Active to its opposite
            deactivateStrat(engineName, stratName, stratVersion);
        } else {
            activateStrat(engineName, stratName, stratVersion);
        }
    };

    function activateStrat(engineName, stratName, stratVersion) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/action-confirm-popup.html',
            controller: 'ActionConfirmPopupCtrl',
            controllerAs: 'actionConfirmPopupCtrl',
            resolve: {
                title: function () {
                    return 'Activate Strat';
                },
                action: function () {
                    return 'activate strat ' + stratName + ' ' + stratVersion + ' on ' + engineName;
                },
                objToPass: function () {
                    return null;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Requesting to activate strat', stratName, stratVersion, 'on', engineName);

            TradeEnginesStratsService.get({
                engineName: engineName,
                action: 'activatestrategy',
                strategyName: stratName,
                strategyVersion: stratVersion
            }, function (result) {
                var tradeEngineIndex = findTradeEngineIndex(engineName);
                var stratIndex = findStratIndex(self.tradeEngines[tradeEngineIndex], stratName, stratVersion);

                if (result.Success) {
                    var successMsg = 'Successfully activated strat ' + stratName + ' ' + stratVersion + ' on ' + engineName;
                    console.log(successMsg);
                    PopupService.showSuccess('Activate Strat', successMsg);

                    // Save the change to the trade engine's config
                    self.tradeEngines[tradeEngineIndex].Strats[stratIndex].Active = true;
                    var tradeEngineBkp = angular.copy(self.tradeEngines[tradeEngineIndex]);
                    delete self.tradeEngines[tradeEngineIndex].status;
                    self.tradeEngines[tradeEngineIndex].$update(function (updated) {
                        console.log('updated', updated.status);
                        self.tradeEngines[tradeEngineIndex] = tradeEngineBkp;
                    });
                } else {
                    var errMsg = 'Failed to activate strat ' + stratName + ' ' + stratVersion + ' on ' + engineName + ': ' + result.Message;
                    console.error(errMsg);
                    PopupService.showError('Activate Strat', errMsg);

                    // Revert the change to the trade engine's config
                    self.tradeEngines[tradeEngineIndex].Strats[stratIndex].Active = false;
                }
            });
        });
    }

    function deactivateStrat(engineName, stratName, stratVersion) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/action-confirm-popup.html',
            controller: 'ActionConfirmPopupCtrl',
            controllerAs: 'actionConfirmPopupCtrl',
            resolve: {
                title: function () {
                    return 'Deactivate Strat';
                },
                action: function () {
                    return 'deactivate strat ' + stratName + ' ' + stratVersion + ' on ' + engineName;
                },
                objToPass: function () {
                    return null;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Requesting to deactivate strat', stratName, stratVersion, 'on', engineName);

            TradeEnginesStratsService.get({
                engineName: engineName,
                action: 'deactivatestrategy',
                strategyName: stratName,
                strategyVersion: stratVersion
            }, function (result) {
                var tradeEngineIndex = findTradeEngineIndex(engineName);
                var stratIndex = findStratIndex(self.tradeEngines[tradeEngineIndex], stratName, stratVersion);

                if (result.Success) {
                    var successMsg = 'Successfully deactivated strat ' + stratName + ' ' + stratVersion + ' on ' + engineName;
                    console.log(successMsg);
                    PopupService.showSuccess('Deactivate Strat', successMsg);

                    // Save the change to the trade engine's config
                    self.tradeEngines[tradeEngineIndex].Strats[stratIndex].Active = false;

                    var tradeEngineBkp = angular.copy(self.tradeEngines[tradeEngineIndex]);
                    delete self.tradeEngines[tradeEngineIndex].status;
                    self.tradeEngines[tradeEngineIndex].$update(function (updated) {
                        console.log('updated', updated.status);
                        self.tradeEngines[tradeEngineIndex] = tradeEngineBkp;
                    });
                } else {
                    var errMsg = 'Failed to deactivate strat ' + stratName + ' ' + stratVersion + ' on ' + engineName + ': ' + result.Message;
                    console.error(errMsg);
                    PopupService.showError('Deactivate Strat', errMsg);

                    // Revert the change to the trade engine's config
                    self.tradeEngines[tradeEngineIndex].Strats[stratIndex].Active = true;
                }
            });
        });
    }

    self.toggleStratTrading = function (isNotTrading, engineName, stratName, stratVersion) {
        if (!isNotTrading) {
            stopTradingStrat(engineName, stratName, stratVersion);
        } else {
            startTradingStrat(engineName, stratName, stratVersion);
        }
    };

    function startTradingStrat(engineName, stratName, stratVersion) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/action-confirm-popup.html',
            controller: 'ActionConfirmPopupCtrl',
            controllerAs: 'actionConfirmPopupCtrl',
            resolve: {
                title: function () {
                    return 'Start Trading Strat';
                },
                action: function () {
                    return 'start trading strat ' + stratName + ' ' + stratVersion + ' on ' + engineName;
                },
                objToPass: function () {
                    return null;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Requesting to start trading strat', stratName, stratVersion, 'on', engineName);

            TradeEnginesStratsService.get({
                engineName: engineName,
                action: 'starttradingstrategy',
                strategyName: stratName,
                strategyVersion: stratVersion
            }, function (result) {
                var tradeEngineIndex = findTradeEngineIndex(engineName);
                var stratIndex = findStratIndex(self.tradeEngines[tradeEngineIndex], stratName, stratVersion);

                if (result.Success) {
                    var successMsg = 'Successfully started trading of strat ' + stratName + ' ' + stratVersion + ' on ' + engineName;
                    console.log(successMsg);
                    PopupService.showSuccess('Start Trading Strat', successMsg);

                    // Save the change to the trade engine's config
                    self.tradeEngines[tradeEngineIndex].Strats[stratIndex].Trading = false;

                    var tradeEngineBkp = angular.copy(self.tradeEngines[tradeEngineIndex]);
                    delete self.tradeEngines[tradeEngineIndex].status;
                    self.tradeEngines[tradeEngineIndex].$update(function (updated) {
                        console.log('updated', updated.status);
                        self.tradeEngines[tradeEngineIndex] = tradeEngineBkp;
                    });
                } else {
                    var errMsg = 'Failed to start trading strat ' + stratName + ' ' + stratVersion + ' on ' + engineName + ': ' + result.Message;
                    console.error(errMsg);
                    PopupService.showError('Start Trading Strat', errMsg);

                    // Revert the change to the trade engine's config
                    self.tradeEngines[tradeEngineIndex].Strats[stratIndex].Trading = true;
                }
            });
        });
    }

    function stopTradingStrat(engineName, stratName, stratVersion) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/action-confirm-popup.html',
            controller: 'ActionConfirmPopupCtrl',
            controllerAs: 'actionConfirmPopupCtrl',
            resolve: {
                title: function () {
                    return 'Stop Trading Strat';
                },
                action: function () {
                    return 'stop trading strat ' + stratName + ' ' + stratVersion + ' on ' + engineName;
                },
                objToPass: function () {
                    return null;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Requesting to stop trading strat', stratName, stratVersion, 'on', engineName);

            TradeEnginesStratsService.get({
                engineName: engineName,
                action: 'stoptradingstrategy',
                strategyName: stratName,
                strategyVersion: stratVersion
            }, function (result) {
                var tradeEngineIndex = findTradeEngineIndex(engineName);
                var stratIndex = findStratIndex(self.tradeEngines[tradeEngineIndex], stratName, stratVersion);

                if (result.Success) {
                    var successMsg = 'Successfully stopped trading of strat ' + stratName + ' ' + stratVersion + ' on ' + engineName;
                    console.log(successMsg);
                    PopupService.showSuccess('Stop Trading Strat', successMsg);

                    // Save the change to the trade engine's config
                    self.tradeEngines[tradeEngineIndex].Strats[stratIndex].Trading = false;

                    var tradeEngineBkp = angular.copy(self.tradeEngines[tradeEngineIndex]);
                    delete self.tradeEngines[tradeEngineIndex].status;
                    self.tradeEngines[tradeEngineIndex].$update(function (updated) {
                        console.log('updated', updated.status);
                        self.tradeEngines[tradeEngineIndex] = tradeEngineBkp;
                    });
                } else {
                    var errMsg = 'Failed to stop trading strat ' + stratName + ' ' + stratVersion + ' on ' + engineName + ': ' + result.Message;
                    console.error(errMsg);
                    PopupService.showError('Stop Trading Strat', errMsg);

                    // Revert the change to the trade engine's config
                    self.tradeEngines[tradeEngineIndex].Strats[stratIndex].Trading = true;
                }
            });
        });
    }

    self.formatTradingStatus = function (isTrading) {
        if (isTrading) {
            return 'Trading';
        } else {
            return 'Not Trading';
        }
    };

    self.formatConnectedToIBStatus = function (isConnectedToIB) {
        if (isConnectedToIB) {
            return 'Connected to IB';
        } else {
            return 'Not Connected to IB';
        }
    };

    self.formatId = function (id) {
        if (id) {
            return id.Name + ' - v' + id.Version;
        } else {
            return null;
        }
    };

    var startRequestStatus = function () {
        // 1. Initial load
        requestStatus();

        // 2. Subsequent loads, on timer
        statusTask = $interval(requestStatus, 10000);
    };

    var stopLoadData = function () {
        if (statusTask) {
            console.log('Stopping polling of statuses');
            $interval.cancel(statusTask);
        }

        statusRequested = false;
    };

    function requestStatus() {
        SystemsStatusService.query(function (statuses) {
            if (statuses) {
                for (var i = 0; i < statuses.length; i++) {
                    for (var k = 0; k < self.tradeEngines.length; k++) {
                        if (self.tradeEngines[k].Name === statuses[i].Name) {
                            self.tradeEngines[k].status = angular.copy(statuses[i]);
                        }
                    }
                }
            }
        });
    }

    function findTradeEngineIndex(engineName) {
        for (var i = 0; i < self.tradeEngines.length; i++) {
            if (self.tradeEngines[i].Name === engineName) {
                return i;
            }
        }

        return -1;
    }

    $scope.$on('$destroy', function () {
        stopLoadData();
    });

}]);
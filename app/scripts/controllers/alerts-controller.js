'use strict';

angular.module('monitorApp')
.controller('AlertsCtrl', ['$cacheFactory', '$scope', '$rootScope', '$uibModal', '$interval', 'AlertsCloseService', 'MonitoringAppService', 'ExecutionsService', 'ExecutionDetailsService', 'FXEventsTodayHighService', 'PopupService', 'TradeEnginesService', 'CommonsService', 'TradesService', 'SystemsStatusService', function ($cacheFactory, $scope, $rootScope, $uibModal, $interval, AlertsCloseService, MonitoringAppService, ExecutionsService, ExecutionDetailsService, FXEventsTodayHighService, PopupService, TradeEnginesService, CommonsService, TradesService, SystemsStatusService) {

    var self = this;

    var cache = $cacheFactory.get('alertsCtrl') || $cacheFactory('alertsCtrl');

    self.openAlerts = MonitoringAppService.getAllOpenAlerts();
    self.alertsClosedToday = MonitoringAppService.getAlertsClosedToday();

    self.systems = [];
    var systemsQueryTask = null;
    var systemsRequested = false;

    self.collapseAlertsClosedToday = false;
    self.collapseAlertsClosedTodayButtonTitle = 'Hide';

    self.position = cache.get('alertsCtrl.position') || {};

    self.executions = [];
    self.grossPnl = 0;
    self.grossPnlPerCross = [];
    self.totalCommissions = 0;

    self.crosses = [];

    console.log($scope.userInfo.userName);

    self.todayHighImpactEvents = FXEventsTodayHighService.query();
    self.today = new Date();

    function setGrosPnlAndTotalFees(pnlValueToAdd, feesValueToAdd) {
        // Total gross PnL
        self.grossPnl = self.grossPnl + pnlValueToAdd;

        // Total commissions
        self.totalCommissions = self.totalCommissions + feesValueToAdd;

        TradesService.setNetPnl(self.grossPnl - self.totalCommissions);
    }

    ExecutionsService.query({ day: (new Date()).toISOString() }, function (executions) {
        self.executions = executions;

        self.totalCommissions = 0;

        for (var i = 0; i < self.executions.length; i++) {
            setGrosPnlAndTotalFees(self.executions[i].RealizedPnlUsd, self.executions[i].CommissionUsd);

            // Gross PnL per cross
            var existingIndex = findCrossIndexInPnlArray(self.executions[i].Cross);

            if (existingIndex > -1) {
                self.grossPnlPerCross[existingIndex].grossPnl = self.grossPnlPerCross[existingIndex].grossPnl + (self.executions[i].RealizedPnlUsd || 0);
            }
            else {
                self.grossPnlPerCross.push({
                    cross: self.executions[i].Cross,
                    grossPnl: self.executions[i].RealizedPnlUsd || 0
                });
            }
        }
    });

    function findCrossIndexInPnlArray(cross) {
        for (var i = 0; i < self.grossPnlPerCross.length; i++) {
            if (self.grossPnlPerCross[i].cross === cross) {
                return i;
            }
        }

        return -1;
    }

    self.getPnlForCross = function (cross) {
        var index = findCrossIndexInPnlArray(cross);

        if (index > -1) {
            return self.grossPnlPerCross[index].grossPnl || 0;
        }
        else {
            return 0;
        }
    };

    function calculatePnl() {
        if (!self.position.PositionSecurities || self.position.PositionSecurities.length === 0) {
            return 'N/A';
        } else {
            var unrealisedPnl = 0;

            for (var i = 0; i < self.position.PositionSecurities.length; i++) {
                unrealisedPnl = unrealisedPnl + self.position.PositionSecurities[i].UnrealizedPnlUsd;
            }

            self.position.curUnrealisedPnl = unrealisedPnl;
        }
    }

    self.doCollapseAlertsClosedToday = function () {
        self.collapseAlertsClosedToday = !self.collapseAlertsClosedToday;

        if (self.collapseAlertsClosedToday) {
            self.collapseAlertsClosedTodayButtonTitle = 'Show';
        } else {
            self.collapseAlertsClosedTodayButtonTitle = 'Hide';
        }
    };

    self.closeAlert = function (alertId) {
        AlertsCloseService.save({
            ids: [alertId]
        }, function (result) {
            if (result.success) {
                console.log('Closed alert', alertId);
            } else {
                console.error('Failed to closed alert', alertId);
            }
        });
    };

    self.closeAllOpenAlerts = function () {
        var idsToClose = self.openAlerts.map(function (alert) {
            return alert.AlertId;
        });

        AlertsCloseService.save({
            ids: idsToClose
        }, function (result) {
            console.log(result);
        });
    };

    self.showOpenAlertDetails = function (index) {
        $uibModal.open({
            templateUrl: 'views/alert-details.html',
            controller: 'AlertDetailsCtrl as alertDetailsCtrl',
            resolve: {
                alert: function () {
                    return self.openAlerts[index];
                }
            }
        });
    };

    self.showClosedAlertDetails = function (index) {
        $uibModal.open({
            templateUrl: 'views/alert-details.html',
            controller: 'AlertDetailsCtrl as alertDetailsCtrl',
            resolve: {
                alert: function () {
                    return self.alertsClosedToday[index];
                }
            }
        });
    };

    self.overallSystemStatus = function () {
        var status = 'GREEN';

        for (var i = 0; i < self.systems.length; i++) {
            if (self.systems[i].OverallStatusLevel === 'RED') {
                status = 'RED';
                break;
            } else if (self.systems[i].OverallStatusLevel === 'YELLOW') {
                status = 'YELLOW';
            }
        }

        return status;
    };

    self.formatBool = function (boolVal) {
        if (boolVal === true) {
            return 'Yes';
        } else if (boolVal === false) {
            return 'No';
        } else {
            return 'N/A';
        }
    };

    self.showSystemDetails = function (id) {
        var index = findSystemIndexById(id);

        if (index > -1) {
            $uibModal.open({
                templateUrl: 'views/system-status-details-popup.html',
                controller: 'SystemStatusDetailsPopupCtrl as systemStatusDetailsCtrl',
                size: 'lg',
                resolve: {
                    system: function () {
                        return angular.copy(self.systems[index]);
                    }
                }
            });
        } else {
            console.error('Cannot find system with id', id);
        }
    };

    self.showTradeDetails = function (id) {
        ExecutionDetailsService.get({ id: id }, function (response) {
            if (response) {
                console.log('Received details of execution', id);

                $uibModal.open({
                    templateUrl: 'views/execution-details-popup.html',
                    controller: 'ExecutionDetailsPopupCtrl as executionDetailsCtrl',
                    resolve: {
                        trade: function () {
                            return response;
                        }
                    }
                });
            } else {
                console.error('Failed to load details of execution', id);
            }
        });
    };

    self.findAttributeObject = function (id, attributeName) {
        var index = findSystemIndexById(id);

        if (index > -1) {
            var attrIndex = findAttributeByName(self.systems[index], attributeName);

            if (attrIndex > -1) {
                return self.systems[index].Attributes[attrIndex];
            } else {
                console.error('Cannot find attribute', attributeName);
            }
        } else {
            console.error('Cannot find system with id', id);
        }
    };

    function findSystemIndexById(name) {
        for (var i = 0; i < self.systems.length; i++) {
            if (self.systems[i].Name === name) {
                return i;
            }
        }

        return -1;
    }

    function findAttributeByName(system, attributeName) {
        if (system.Attributes) {
            for (var i = 0; i < system.Attributes.length; i++) {
                if (system.Attributes[i].Name === attributeName) {
                    return i;
                }
            }
        }

        return -1;
    }

    function querySystemsStatuses() {
        SystemsStatusService.query(function (statuses) {
            if (statuses) {
                console.log('Received status updates for', statuses.length, 'systems');

                self.systems.splice(0, self.systems.length);
                self.crosses.splice(0, self.crosses.length);

                for (var i = 0; i < statuses.length; i++) {
                    self.systems.push(statuses[i]);

                    var nonTradingPairsIndex = findAttributeByName(statuses[i], 'NonTradingPairs');

                    if (nonTradingPairsIndex > -1 && statuses[i].Attributes[nonTradingPairsIndex]) {
                        var nonTradingPairs = statuses[i].Attributes[nonTradingPairsIndex].Value.split(', ');

                        for (var jn = 0; jn < nonTradingPairs.length; jn++) {
                            if (nonTradingPairs[jn]) {
                                var nindex = getCrossIndex(nonTradingPairs[jn]);

                                if (nindex < 0) {
                                    self.crosses.push({
                                        name: nonTradingPairs[jn],
                                        trading: false
                                    });
                                } else {
                                    self.crosses[nindex].trading = false;
                                }
                            }
                        }
                    }

                    var tradingPairsIndex = findAttributeByName(statuses[i], 'TradingPairs');

                    if (tradingPairsIndex > -1 && statuses[i].Attributes[tradingPairsIndex]) {
                        var tradingPairs = statuses[i].Attributes[tradingPairsIndex].Value.split(', ');

                        for (var jt = 0; jt < tradingPairs.length; jt++) {
                            var tindex = getCrossIndex(tradingPairs[jt]);

                            if (tindex < 0) {
                                self.crosses.push({
                                    name: tradingPairs[jt],
                                    trading: true
                                });
                            } else {
                                // Do nothing: if the cross is already marked as 'not trading' then we shouldn't override that
                            }
                        }
                    }
                }
            }
        });
    }

    function startQuerySystemsStatuses() {
        // 1. Initial load
        querySystemsStatuses();

        // 2. Subsquent loads, on timer
        systemsQueryTask = $interval(querySystemsStatuses, 10000);
    }

    function findPositionSecurityIndex(cross) {
        for (var i = 0; i < self.position.PositionSecurities.length; i++) {
            if (self.position.PositionSecurities[i].Cross === cross) {
                return i;
            }
        }

        return -1;
    }

    function stopQuerySystemsStatuses() {
        if (systemsQueryTask) {
            console.log('Stopping polling of statuses');
            $interval.cancel(systemsQueryTask);
        }

        systemsRequested = false;
    }

    self.formatRate = function (cross, rate) {
        if (cross.indexOf('JPY') > -1) {
            return rate.toFixed(3);
        } else {
            return rate.toFixed(5);
        }
    };

    self.shortenCross = function (cross) {
        return CommonsService.shortenCross(cross);
    };

    self.shortenSide = function (side) {
        return CommonsService.shortenSide(side);
    };

    self.toggleCrossTrading = function (cross) {
        var crossIndex = getCrossIndex(cross);

        if (crossIndex < 0) {
            console.error('Unable to toggle trading for unknown cross', cross);
        } else {
            self.crosses[crossIndex].btnDisabled = true;

            if (self.crosses[crossIndex].trading) {
                stopTradingCross(cross, crossIndex);
            } else {
                startTradingCross(cross, crossIndex);
            }
        }
    };

    self.getCrossTradingButtonLabel = function (trading) {
        if (trading) {
            return 'Stop';
        } else {
            return 'Start';
        }
    };

    function getCrossIndex(cross) {
        for (var i = 0; i < self.crosses.length; i++) {
            if (self.crosses[i].name === cross) {
                return i;
            }
        }

        return -1;
    }

    function startTradingCross(cross, index) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/action-confirm-popup.html',
            controller: 'ActionConfirmPopupCtrl',
            controllerAs: 'actionConfirmPopupCtrl',
            resolve: {
                title: function () {
                    return 'Start Trading Cross';
                },
                action: function () {
                    return 'start trading cross ' + cross + ' on all trade engines';
                },
                objToPass: function () {
                    return null;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Requesting to start trading cross ' + cross + ' on all trade engines');

            TradeEnginesService.get({
                engineName: 'all',
                action: 'starttrading',
                cross: cross
            }, function (result) {
                if (result.Success) {
                    var successMsg = 'Successfully started trading cross ' + cross + ' on all trade engines';
                    console.log(successMsg);
                    PopupService.showSuccess('Start Trading Cross', successMsg);
                } else {
                    var errMsg = 'Failed to start trading cross ' + cross + ' on all trade engines: ' + result.Message;
                    console.error(errMsg);
                    PopupService.showError('Start Trading Cross', errMsg);
                }

                self.crosses[index].btnDisabled = false;
            });
        }, function () { // dismiss handler
            self.crosses[index].btnDisabled = false;
        });
    }

    function stopTradingCross(cross, index) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/action-confirm-popup.html',
            controller: 'ActionConfirmPopupCtrl',
            controllerAs: 'actionConfirmPopupCtrl',
            resolve: {
                title: function () {
                    return 'Stop Trading Cross';
                },
                action: function () {
                    return 'stop trading cross ' + cross + ' on all trade engines';
                },
                objToPass: function () {
                    return null;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Requesting to stop trading cross ' + cross + ' on all trade engines');

            TradeEnginesService.get({
                engineName: 'all',
                action: 'stoptrading',
                cross: cross
            }, function (result) {
                if (result.Success) {
                    var successMsg = 'Successfully stopped trading cross ' + cross + 'on all trade engines';
                    console.log(successMsg);
                    PopupService.showSuccess('Stop Trading Cross', successMsg);
                } else {
                    var errMsg = 'Failed to stop trading cross ' + cross + ' on all trade engines: ' + result.Message;
                    console.error(errMsg);
                    PopupService.showError('Stop Trading Cross', errMsg);
                }

                self.crosses[index].btnDisabled = false;
            });
        }, function () { // dismiss handler
            self.crosses[index].btnDisabled = false;
        });
    }

    if (!systemsRequested) {
        systemsRequested = true;

        startQuerySystemsStatuses();
    }

    $scope.$on('$destroy', function () {
        stopQuerySystemsStatuses();
    });

    // Event listeners

    $rootScope.$on('newExecutionReceivedEvent', function (event, execution) {
        self.executions.push(execution);

        setGrosPnlAndTotalFees(execution.RealizedPnlUsd, execution.CommissionUsd);

        // Gross PnL per cross
        var existingIndex = findCrossIndexInPnlArray(execution.Cross);

        if (existingIndex > -1) {
            self.grossPnlPerCross[existingIndex].grossPnl = self.grossPnlPerCross[existingIndex].grossPnl + (execution.RealizedPnlUsd || 0);
        }
        else {
            self.grossPnlPerCross.push({
                cross: execution.Cross,
                grossPnl: execution.RealizedPnlUsd || 0
            });
        }
    });

    $rootScope.$on('positionUpdateReceivedEvent', function (event, position) {
        if (!self.position.PositionSecurities) {
            self.position = position;
        }

        for (var i = 0; i < position.PositionSecurities.length; i++) {
            var existingPositionSecurityIndex = findPositionSecurityIndex(position.PositionSecurities[i].Cross);

            if (existingPositionSecurityIndex > -1) { // replace
                self.position.PositionSecurities[existingPositionSecurityIndex].PositionQuantity = position.PositionSecurities[i].PositionQuantity;
                self.position.PositionSecurities[existingPositionSecurityIndex].AverageCost = position.PositionSecurities[i].AverageCost;
                self.position.PositionSecurities[existingPositionSecurityIndex].MarketPrice = position.PositionSecurities[i].MarketPrice;
                self.position.PositionSecurities[existingPositionSecurityIndex].MarketValue = position.PositionSecurities[i].MarketValue;
                self.position.PositionSecurities[existingPositionSecurityIndex].RealizedPnL = position.PositionSecurities[i].RealizedPnL;
                self.position.PositionSecurities[existingPositionSecurityIndex].RealizedPnlUsd = position.PositionSecurities[i].RealizedPnlUsd;
                self.position.PositionSecurities[existingPositionSecurityIndex].UnrealizedPnL = position.PositionSecurities[i].UnrealizedPnL;
                self.position.PositionSecurities[existingPositionSecurityIndex].UnrealizedPnlUsd = position.PositionSecurities[i].UnrealizedPnlUsd;
            } else { // add new
                self.position.PositionSecurities.push(position.PositionSecurities[i]);
            }
        }

        calculatePnl();

        self.position.timestamp = new Date();

        cache.put('alertsCtrl.position', self.position);
    });

    $rootScope.$on('systemStatusUpdateReceived', function (event, status) {
        var index = findSystemIndexById(status.Name);

        if (index > -1) {
            self.systems[index] = status;
        } else {
            console.log('New system status', status.Name);

            self.systems.push(status);
        }
    });

    $rootScope.$on('systemStatusAttributeAckedEvent', function (event, args) {
        ackOrUnackAttribute(args.systemName, args.attributeName, true, args.ackedUntil);
    });

    $rootScope.$on('systemStatusAttributeUnackedEvent', function (event, args) {
        ackOrUnackAttribute(args.systemName, args.attributeName, false, null);
    });

    function ackOrUnackAttribute(systemName, attributeName, isAcked, ackedUntil) {
        var systemIndex = findSystemIndexById(systemName);

        if (systemIndex > -1) {
            var attributeIndex = findAttributeByName(self.systems[systemIndex], attributeName);

            if (attributeIndex > -1) {
                self.systems[systemIndex].Attributes[attributeIndex].Acked = isAcked;
                self.systems[systemIndex].Attributes[attributeIndex].AckedUntil = ackedUntil;
            } else {
                console.error('Received acked notification for unknown attribute', attributeName, 'of system', systemName);
            }
        } else {
            console.error('Received attribute acked notification for unknown system', systemName);
        }
    }
}]);
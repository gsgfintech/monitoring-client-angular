'use strict';

angular.module('monitorApp')
.controller('AlertsCtrl', ['$scope', '$rootScope', '$uibModal', '$interval', 'AlertsCloseService', 'MonitoringAppService', 'ExecutionsService', 'ExecutionDetailsService', 'PositionsService', 'SystemsStatusService', function ($scope, $rootScope, $uibModal, $interval, AlertsCloseService, MonitoringAppService, ExecutionsService, ExecutionDetailsService, PositionsService, SystemsStatusService) {

    var self = this;

    self.openAlerts = MonitoringAppService.getAllOpenAlerts();
    self.alertsClosedToday = MonitoringAppService.getAlertsClosedToday();

    self.systems = [];
    var systemsQueryTask = null;
    var systemsRequested = false;

    self.collapseAlertsClosedToday = false;
    self.collapseAlertsClosedTodayButtonTitle = 'Hide';

    self.position = {};

    self.executions = [];
    self.grossPnl = 0;
    self.grossPnlPerCross = [];
    self.totalCommissions = 0;

    PositionsService.query({}, function (positions) {
        console.log('Received latest positions');

        if (positions.length > 0) {
            self.position.positions = positions[0].PositionSecurities;
            self.position.timestamp = positions[0].Timestamp;

            calculatePnl();
        }
    });

    ExecutionsService.query({ day: (new Date()).toISOString() }, function (executions) {
        self.executions = executions;

        self.totalCommissions = 0;

        for (var i = 0; i < self.executions.length; i++) {
            // Total gross PnL
            self.grossPnl = self.grossPnl + self.executions[i].RealizedPnlUsd;

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

            // Total commissions
            self.totalCommissions = self.totalCommissions + self.executions[i].CommissionUsd;
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
        if (!self.position.positions || self.position.positions.length === 0) {
            return 'N/A';
        } else {
            var unrealisedPnl = 0;

            for (var i = 0; i < self.position.positions.length; i++) {
                unrealisedPnl = unrealisedPnl + self.position.positions[i].UnrealizedPnlUsd;
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
                templateUrl: 'views/system-status-details.html',
                controller: 'SystemStatusDetailsCtrl as systemStatusDetailsCtrl',
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
                    templateUrl: 'views/execution-details.html',
                    controller: 'ExecutionDetailsCtrl as executionDetailsCtrl',
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
        for (var i = 0; i < system.Attributes.length; i++) {
            if (system.Attributes[i].Name === attributeName) {
                return i;
            }
        }

        return -1;
    }

    function querySystemsStatuses() {
        SystemsStatusService.query(function (statuses) {
            if (statuses) {
                console.log('Received status updates for', statuses.length, 'systems');

                self.systems.splice(0, self.systems.length);

                for (var i = 0; i < statuses.length; i++) {
                    self.systems.push(statuses[i]);
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
        for (var i = 0; i < self.position.positions.length; i++) {
            if (self.position.positions[i].Cross === cross) {
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
        return cross.replace('USD', '').replace('/', '');
    };

    self.shortenSide = function (side) {
        return side.substring(0, 1);
    };

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

        // Total gross PnL
        self.grossPnl = self.grossPnl + execution.RealizedPnlUsd;

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

        // Total commissions
        self.totalCommissions = self.totalCommissions + execution.CommissionUsd;
    });

    $rootScope.$on('positionUpdateReceivedEvent', function (event, position) {
        for (var i = 0; i < position.PositionSecurities.length; i++) {
            var existingPositionSecurityIndex = findPositionSecurityIndex(position.PositionSecurities[i].Cross);

            if (existingPositionSecurityIndex > -1) { // replace
                self.position.positions[existingPositionSecurityIndex].PositionQuantity = position.PositionSecurities[i].PositionQuantity;
                self.position.positions[existingPositionSecurityIndex].AverageCost = position.PositionSecurities[i].AverageCost;
                self.position.positions[existingPositionSecurityIndex].MarketPrice = position.PositionSecurities[i].MarketPrice;
                self.position.positions[existingPositionSecurityIndex].MarketValue = position.PositionSecurities[i].MarketValue;
                self.position.positions[existingPositionSecurityIndex].RealizedPnL = position.PositionSecurities[i].RealizedPnL;
                self.position.positions[existingPositionSecurityIndex].RealizedPnlUsd = position.PositionSecurities[i].RealizedPnlUsd;
                self.position.positions[existingPositionSecurityIndex].UnrealizedPnL = position.PositionSecurities[i].UnrealizedPnL;
                self.position.positions[existingPositionSecurityIndex].UnrealizedPnlUsd = position.PositionSecurities[i].UnrealizedPnlUsd;
            } else { // add new
                self.position.positions.push(position.PositionSecurities[i]);
            }
        }

        calculatePnl();
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
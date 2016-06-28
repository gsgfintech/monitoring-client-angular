'use strict';

angular.module('monitorApp')
.controller('ExecutionsCtrl', ['$cacheFactory', '$scope', '$location', '$rootScope', '$state', '$stateParams', '$uibModal', 'FileSaver', 'MonitoringAppService', 'ExecutionsService', 'ExecutionDetailsService', 'ExecutionsExcelService', 'MenuService', 'CommonsService', function ($cacheFactory, $scope, $location, $rootScope, $state, $stateParams, $uibModal, FileSaver, MonitoringAppService, ExecutionsService, ExecutionDetailsService, ExecutionsExcelService, MenuService, CommonsService) {

    var self = this;

    function formatDate(date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = date.getDate().toString();
        return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]); // padding
    }

    var cache = $cacheFactory.get('executionsCtrl') || $cacheFactory('executionsCtrl');

    self.activeDate = cache.get('executionsCtrl.activeDate') || ($stateParams.date ? new Date($stateParams.date) : new Date());

    cache.put('executionsCtrl.activeDate', self.activeDate);

    var activeDateStr = formatDate(self.activeDate);

    $location.path('/executions/day/' + activeDateStr);
    $state.go('executions-day', { date: activeDateStr });

    self.executions = [];
    self.grossPnl = 0;
    self.grossPnlPerCross = [];
    self.executionsCount = 0;
    self.totalCommissions = 0;

    self.latestPositions = MonitoringAppService.getLatestPositions();

    self.downloading = false;

    self.requestAccount = function (accountName) {
        MonitoringAppService.requestAccount(accountName);
    };

    self.changeDate = function () {
        cache.put('executionsCtrl.activeDate', self.activeDate);

        var activeDateStr = formatDate(self.activeDate);

        // Update path in address bar
        $location.path('/executions/day/' + activeDateStr);

        $state.go('executions-day', { date: activeDateStr });

        getExecutions();
    };

    function getExecutions() {
        ExecutionsService.query({ day: self.activeDate.toISOString() }, function (executions) {
            self.executions = executions;

            MenuService.getTabsCounts().tradesCount = executions.length;

            self.grossPnl = 0;
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
    }

    function findCrossIndexInPnlArray(cross) {
        for (var i = 0; i < self.grossPnlPerCross.length; i++) {
            if (self.grossPnlPerCross[i].cross === cross) {
                return i;
            }
        }

        return -1;
    }

    self.formatRate = function (cross, rate) {
        return CommonsService.formatRate(cross, rate);
    };

    self.shortenOrigin = function (origin) {
        return CommonsService.shortenOrigin(origin);
    };

    self.shortenCross = function (cross) {
        return CommonsService.shortenCross(cross);
    };

    self.shortenSide = function (side) {
        return CommonsService.shortenSide(side);
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

    self.exportToExcel = function () {
        console.log('Requesting Excel file for', self.date);

        self.downloading = true;

        ExecutionsExcelService.download({
            day: self.activeDate.toISOString()
        }, function (result) {
            console.log('Received ', result.response.filename);

            var blob = result.response.blob;
            var filename = result.response.filename || 'export.xlsx';

            FileSaver.saveAs(blob, filename);

            self.downloading = false;
        });
    };

    $rootScope.$on('newExecutionReceivedEvent', function (event, execution) {
        var executionTime = new Date(execution.ExecutionTime);

        // Only reload if we're looking at today's trades
        if (executionTime.getDate() === self.activeDate.getDate()) {
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
        }
    });

    $rootScope.$on('accounts.accountReceived', function (event, args) {
        var activeAccount = args.account;

        if (activeAccount) {
            $uibModal.open({
                templateUrl: 'views/account-details.html',
                controller: 'AccountDetailsCtrl as accountDetailsCtrl',
                animation: true,
                resolve: {
                    account: function () {
                        return activeAccount;
                    }
                }
            });
        }
    });

    getExecutions();

}]);
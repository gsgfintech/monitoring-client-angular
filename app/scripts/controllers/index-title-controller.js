'use strict';

angular.module('monitorApp')
.controller('IndexTitleCtrl', ['$rootScope', 'TradesService', function ($rootScope, TradesService) {

    var self = this;

    var netPnl = TradesService.getNetPnl();

    self.title = 'FX Monitor';

    function updateTitle() {
        if (netPnl > 0) {
            self.title = '+' + netPnl + '$ - FX Mon';
        } else if (netPnl < 0) {
            self.title = netPnl + '$ - FX Mon';
        } else {
            self.title = 'FX Monitor';
        }
    }

    // Event handlers

    $rootScope.$on('tradesService.netPnlUpdated', function (event, data) {
        if (data.netPnl) {
            netPnl = data.netPnl;

            updateTitle();
        }
    });

}]);

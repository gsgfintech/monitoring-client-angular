'use strict';

angular.module('monitorApp')
.controller('ExecutionDetailsPopupCtrl', ['$uibModalInstance', 'trade', 'serverEnpoint', function ($uibModalInstance, trade, serverEnpoint) {

    var self = this;

    self.trade = trade;

    self.detailsLink = serverEnpoint + '#/executions/id/' + trade.ExecutionId;

    self.close = function () {
        $uibModalInstance.dismiss('cancel');
    };

}])
.controller('ExecutionDetailsCtrl', ['$stateParams', 'ExecutionDetailsService', function ($stateParams, ExecutionDetailsService) {

    var self = this;

    self.trade = null;

    var tradeId = $stateParams.id;

    if (tradeId) {
        ExecutionDetailsService.get({ id: tradeId }, function (response) {
            if (response) {
                console.log('Received details of execution', tradeId);

                self.trade = response;
            } else {
                console.error('Failed to load details of execution', tradeId);
            }
        });
    }

}]);
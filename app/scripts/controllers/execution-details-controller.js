'use strict';

angular.module('monitorApp')
.controller('ExecutionDetailsCtrl', ['$uibModalInstance', 'trade', function ($uibModalInstance, trade) {

    var self = this;

    self.trade = trade;

    self.close = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
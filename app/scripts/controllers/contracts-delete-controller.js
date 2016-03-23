'use strict';

angular.module('monitorApp')
.controller('ContractsDeleteCtrl', ['$uibModalInstance', 'contract', function ($uibModalInstance, contract) {

    var self = this;

    self.contract = contract;

    self.submit = function () {
        console.log('Closing modal with contract:', self.contract);
        $uibModalInstance.close(self.contract);
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

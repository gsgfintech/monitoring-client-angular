'use strict';

angular.module('monitorApp')
.controller('ContractsEditCtrl', ['$uibModalInstance', 'contract', function ($uibModalInstance, contract) {

    var self = this;

    self.contract = contract;

    self.cross = function () {
        if (self.contract.Currency && self.contract.Symbol) {
            return self.contract.Symbol + '/' + self.contract.Currency;
        } else {
            return null;
        }
    };

    self.submit = function () {
        self.contract.Cross = self.cross();

        console.log('Closing modal with contract:', self.contract);
        $uibModalInstance.close(self.contract);
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

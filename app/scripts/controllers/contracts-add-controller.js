'use strict';

angular.module('monitorApp')
.controller('ContractsAddCtrl', ['$uibModalInstance', 'ContractsService', function ($uibModalInstance, ContractsService) {

    var self = this;

    self.contractId = null;
    self.symbol = null;
    self.currency = null;

    self.cross = function () {
        if (self.currency && self.symbol) {
            return self.symbol + '/' + self.currency;
        } else {
            return null;
        }
    };

    self.securityType = 'CASH';
    self.exchange = 'IDEALPRO';

    self.submit = function () {
        var contract = new ContractsService();
        contract.ContractID = self.contractId;
        contract.Symbol = self.symbol;
        contract.Currency = self.currency;
        contract.Cross = self.cross();
        contract.SecurityType = self.securityType;
        contract.Exchange = self.exchange;

        console.log('Closing modal with contract:', contract);
        $uibModalInstance.close(contract);
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

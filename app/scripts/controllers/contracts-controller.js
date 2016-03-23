'use strict';

angular.module('monitorApp')
.controller('ContractsCtrl', ['$rootScope', '$uibModal', 'ContractsService', function ($rootScope, $uibModal, ContractsService) {

    var self = this;

    self.contracts = ContractsService.query();

    self.add = function () {
        console.log('Add new contract');

        var modalInstance = $uibModal.open({
            templateUrl: 'views/contracts-add.html',
            controller: 'ContractsAddCtrl as contractsAddCtrl'
        });

        modalInstance.result.then(function (newContract) {
            newContract.$save(function (result) {
                console.log(result.status);

                var contract = new ContractsService();
                contract.ContractID = result.contract.ContractID;
                contract.Symbol = result.contract.Symbol;
                contract.Currency = result.contract.Currency;
                contract.Cross = result.contract.Cross;
                contract.SecurityType = result.contract.SecurityType;
                contract.Exchange = result.contract.Exchange;

                self.contracts.push(contract);
            });
        });
    };

    self.edit = function (contractId) {
        console.log('Edit', contractId);

        var index = getContractIndex(contractId);

        var modalInstance = $uibModal.open({
            templateUrl: 'views/contracts-edit.html',
            controller: 'ContractsEditCtrl as contractsEditCtrl',
            resolve: {
                contract: function () {
                    return angular.copy(self.contracts[index]);
                }
            }
        });

        modalInstance.result.then(function (updatedContract) {
            updatedContract.$update({ id: updatedContract.ContractID }, function (result) {
                console.log(result.status);

                var contract = new ContractsService();
                contract.ContractID = result.contract.ContractID;
                contract.Symbol = result.contract.Symbol;
                contract.Currency = result.contract.Currency;
                contract.Cross = result.contract.Cross;
                contract.SecurityType = result.contract.SecurityType;
                contract.Exchange = result.contract.Exchange;

                self.contracts[index] = contract;
            });
        });
    };

    self.delete = function (contractId) {
        console.log('Delete', contractId);

        var index = getContractIndex(contractId);

        var modalInstance = $uibModal.open({
            templateUrl: 'views/contracts-delete.html',
            controller: 'ContractsDeleteCtrl as contractsDeleteCtrl',
            resolve: {
                contract: function () {
                    return self.contracts[index];
                }
            }
        });

        modalInstance.result.then(function (contractToDelete) {
            contractToDelete.$delete({ id: contractToDelete.ContractID }, function (result) {
                console.log(result.status);

                self.contracts.splice(index, 1);
            });
        });
    };

    function getContractIndex(contractId) {
        for (var i = 0; i < self.contracts.length; i++) {
            if (self.contracts[i].ContractID === contractId) {
                return i;
            }
        }

        return -1;
    }

    // Event listeners

    $rootScope.$on('contractDeletedEvent', function (event, args) {
        var index = getContractIndex(args.id);

        if (index > -1) {
            console.log('Removing contract', args.id, 'from the list');

            self.contracts.splice(index, 1);
        }
    });

    $rootScope.$on('contractInsertedEvent', function (event, contract) {
        var index = getContractIndex(contract.ContractID);

        if (index < 0) { // Make sure that we don't have this contract in the list already
            console.log('Adding new contract', contract.ContractID);

            self.contracts.push(contract);
        }
    });

    $rootScope.$on('contractUpdatedEvent', function (event, contract) {
        var index = getContractIndex(contract.ContractID);

        if (index > -1) {
            console.log('Updating contract', contract.ContractID);

            self.contracts[index] = contract;
        } else {
            console.error('Received updated notification for unknown contract', contract.ContractID);
        }
    });

}]);

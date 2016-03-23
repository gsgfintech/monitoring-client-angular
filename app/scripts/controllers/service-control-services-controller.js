'use strict';

angular.module('monitorApp')
.controller('ServiceControlServiceCtrl', ['$uibModal', 'SystemsConfigsService', function ($uibModal, SystemsConfigsService) {

    var self = this;

    self.services = [];

    function loadServicesConfigs() {
        SystemsConfigsService.query(function (configs) {
            if (configs) {
                self.services.splice(0, self.services.length);

                for (var i = 0; i < configs.length; i++) {
                    if (configs[i].SystemType === 'ServiceControllerService') {
                        self.services.push(configs[i]);
                    }
                }
            }
        });
    }

    self.editConfig = function (config) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/service-control-service-edit.html',
            controller: 'ServiceControlServiceEditCtrl',
            controllerAs: 'serviceControlServiceEditCtrl',
            size: 'lg',
            resolve: {
                config: function () {
                    return angular.copy(config);
                }
            }
        });

        modalInstance.result.then(function (updatedConfig) {
            updatedConfig.$update(function (updated) {
                console.log(updated.status);

                loadServicesConfigs();
            });
        });
    };

    loadServicesConfigs();

}]);

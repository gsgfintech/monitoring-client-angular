'use strict';

angular.module('monitorApp')
.controller('StratConfigsCtrl', ['$uibModal', 'StratConfigsService', function ($uibModal, StratConfigsService) {

    var self = this;

    self.configs = StratConfigsService.query();

    self.duplicate = function (config) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/strat-configs-add.html',
            controller: 'StratConfigsAddCtrl',
            controllerAs: 'stratConfigsAddCtrl',
            resolve: {
                model: function () {
                    return config;
                },
                nextVersion: function () {
                    return getNextConfigVersion(config.StratName, config.StratVersion);
                }
            }
        });

        modalInstance.result.then(function (newConfig) {
            StratConfigsService.save(newConfig, function (inserted) {
                console.log(inserted.status);

                self.configs = StratConfigsService.query();
            });
        });
    };

    self.delete = function (config) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/strat-configs-delete.html',
            controller: 'StratConfigsDeleteCtrl',
            controllerAs: 'stratConfigsDeleteCtrl',
            resolve: {
                config: function () {
                    return config;
                }
            }
        });

        modalInstance.result.then(function (config) {
            config.$remove(function (deleted) {
                console.log('Deleted config', deleted.status);

                self.configs = StratConfigsService.query();
            });
        });
    };

    function getNextConfigVersion(stratName, stratVersion) {
        var nextVersion = 0;

        for (var i = 0; i < self.configs.length; i++) {
            if (self.configs[i].StratName === stratName && self.configs[i].StratVersion === stratVersion) {
                if (self.configs[i].ConfigVersion > nextVersion) {
                    nextVersion = self.configs[i].ConfigVersion;
                }
            }
        }

        return ++nextVersion;
    }

}]);
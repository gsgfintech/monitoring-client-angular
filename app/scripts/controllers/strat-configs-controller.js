'use strict';

angular.module('monitorApp')
.controller('StratConfigsCtrl', ['$uibModal', 'StratConfigsService', function ($uibModal, StratConfigsService) {

    var self = this;

    self.configs = [];
    self.stratedgeConfigs = {};

    self.stratedgeConfigEditIndex = null;
    self.allStratedgeConfigs = {};

    StratConfigsService.query(function (configs) {
        if (configs) {
            for (var i = 0; i < configs.length; i++) {
                if (configs[i].StratName.indexOf('Stratedge1602') > -1) {
                    if (self.stratedgeConfigs[configs[i].StratVersion]) {
                        self.stratedgeConfigs[configs[i].StratVersion].push(configs[i]);
                    } else {
                        self.stratedgeConfigs[configs[i].StratVersion] = [configs[i]];
                    }
                }
                else {
                    self.configs.push(configs[i]);
                }
            }
        }
    });

    self.toggleStratedgeConfigEditIndex = function (versionToEdit) {
        self.stratedgeConfigEditIndex = versionToEdit;
    };

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
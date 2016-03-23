'use strict';

angular.module('monitorApp')
.controller('StratConfigsDeleteCtrl', ['$uibModalInstance', 'config', function ($uibModalInstance, config) {

    var self = this;

    self.config = config;

    self.submit = function () {
        $uibModalInstance.close(self.config);
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

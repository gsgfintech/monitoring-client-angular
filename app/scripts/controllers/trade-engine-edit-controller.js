'use strict';

angular.module('monitorApp')
.controller('TradeEngineEditCtrl', ['$uibModalInstance', 'config', function ($uibModalInstance, config) {

    var self = this;

    self.config = config;

    self.submit = function () {
        console.log('Closing modal with config:', self.config);
        $uibModalInstance.close(self.config);
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

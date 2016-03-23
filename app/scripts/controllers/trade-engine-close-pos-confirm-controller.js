'use strict';

angular.module('monitorApp')
.controller('TradeEngineClosePosConfirmCtrl', ['$uibModalInstance', 'engineName', function ($uibModalInstance, engineName) {

    var self = this;

    self.engineName = engineName;

    self.submit = function () {
        $uibModalInstance.close();
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

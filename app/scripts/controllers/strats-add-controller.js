'use strict';

angular.module('monitorApp')
.controller('StratsAddCtrl', ['$uibModalInstance', 'StratService', function ($uibModalInstance, StratService) {

    var self = this;

    self.name = null;
    self.version = null;
    self.dllPath = null;
    self.stratTypeName = null;

    self.submit = function () {
        var strat = new StratService();
        strat.Name = self.name;
        strat.Version = self.version;
        strat.DllPath = self.dllPath;
        strat.StratTypeName = self.stratTypeName;

        console.log('Closing modal with strat:', strat);
        $uibModalInstance.close(strat);
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

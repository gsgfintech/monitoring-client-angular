'use strict';

angular.module('monitorApp')
.controller('StratsDeleteCtrl', ['$uibModalInstance', 'strat', function ($uibModalInstance, strat) {

    var self = this;

    self.strat = strat;

    self.submit = function () {
        console.log('Closing modal with strat:', self.strat);
        $uibModalInstance.close(self.strat);
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

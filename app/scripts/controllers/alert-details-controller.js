'use strict';

angular.module('monitorApp')
.controller('AlertDetailsCtrl', ['$uibModalInstance', 'alert', function ($uibModalInstance, alert) {

    var self = this;

    self.title = 'Details';

    self.alert = alert;

    self.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
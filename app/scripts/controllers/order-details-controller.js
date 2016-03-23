'use strict';

angular.module('monitorApp')
.controller('OrderDetailsCtrl', ['$uibModalInstance', 'order', function ($uibModalInstance, order) {

    var self = this;

    self.order = order;

    self.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
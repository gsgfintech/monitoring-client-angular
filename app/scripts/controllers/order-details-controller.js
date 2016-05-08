'use strict';

angular.module('monitorApp')
.controller('OrderDetailsPopupCtrl', ['$uibModalInstance', 'order', function ($uibModalInstance, order) {

    var self = this;

    self.order = order;

    self.detailsLink = '#/orders/id/' + order.PermanentID;

    self.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
.controller('OrderDetailsCtrl', ['$stateParams', 'OrderDetailsService', function ($stateParams, OrderDetailsService) {

    var self = this;

    self.order = null;

    var permId = $stateParams.id;

    if (permId) {
        OrderDetailsService.get({ id: permId }, function (response) {
            if (response) {
                console.log('Received details of order', permId);

                self.order = response;
            } else {
                console.error('Failed to load details of order', permId);
            }
        });
    }

}]);
'use strict';

angular.module('monitorApp')
.controller('AccountDetailsCtrl', ['$modalInstance', 'account', function ($modalInstance, account) {

    var self = this;

    self.title = 'Account ' + account.Name;

    self.account = account;

    self.close = function () {
        $modalInstance.close('cancel');
    };
}]);
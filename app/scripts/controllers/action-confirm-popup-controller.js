'use strict';

angular.module('monitorApp')
.controller('ActionConfirmPopupCtrl', ['$uibModalInstance', 'title', 'action', 'objToPass', function ($uibModalInstance, title, action, objToPass) {

    var self = this;

    self.title = title;
    self.action = action;
    self.objToPass = objToPass;

    self.submit = function () {
        $uibModalInstance.close(objToPass);
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

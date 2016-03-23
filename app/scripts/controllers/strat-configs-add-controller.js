'use strict';

angular.module('monitorApp')
.controller('StratConfigsAddCtrl', ['$uibModalInstance', 'model', 'nextVersion', function ($uibModalInstance, model, nextVersion) {

    var self = this;

    self.showAddForm = false;
    self.newFieldKey = null;

    self.config = angular.copy(model);

    delete self.config._id;
    self.config.ConfigVersion = nextVersion;

    self.deleteField = function (field) {
        delete self.config[field];
    };

    self.addField = function () {
        if (!self.config[self.newFieldKey]) {
            self.config[self.newFieldKey] = null;
        } else {
            console.error('This key already exists');
        }

        self.clearAddForm();
    };

    self.clearAddForm = function () {
        self.showAddForm = !self.showAddForm;
        self.newFieldKey = null;
    };

    self.submit = function () {
        $uibModalInstance.close(self.config);
    };

    self.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

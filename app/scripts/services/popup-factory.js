'use strict';

angular.module('monitorApp')
.factory('PopupService', ['toaster', function (toaster) {

    var showError = function (title, message) {
        toaster.pop('error', title, message);
    };

    var showNote = function (title, message) {
        toaster.pop('note', title, message);
    };

    var showSuccess = function (title, message) {
        toaster.pop('success', title, message);
    };

    var showWait = function (title, message) {
        toaster.pop('wait', title, message);
    };

    var showWarning = function (title, message) {
        toaster.pop('warning', title, message);
    };

    return {
        showError: showError,
        showNote: showNote,
        showSuccess: showSuccess,
        showWait: showWait,
        showWarning: showWarning
    };
}]);
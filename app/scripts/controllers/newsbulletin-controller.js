'use strict';

angular.module('monitorApp')
.controller('NewsBulletinsCtrl', ['$scope', '$rootScope', '$timeout', 'NewsBulletinsByStatusService', 'NewsBulletinsClosedTodayService', 'NewsBulletinsCloseService', function ($scope, $rootScope, $timeout, NewsBulletinsByStatusService, NewsBulletinsClosedTodayService, NewsBulletinsCloseService) {

    var self = this;

    self.openBulletins = [];
    self.bulletinsClosedToday = [];

    function getOpenBulletins() {
        NewsBulletinsByStatusService.query({ status: 'Open' }, function (bulletins) {
            console.log('Received open bulletins');

            self.openBulletins.splice(0, self.openBulletins.length);

            for (var i = 0; i < bulletins.length; i++) {
                self.openBulletins.push(bulletins[i]);
            }
        });
    }

    function getBulletinsClosedToday() {
        NewsBulletinsClosedTodayService.query({}, function (bulletins) {
            console.log('Received bulletins closed today');

            self.bulletinsClosedToday.splice(0, self.bulletinsClosedToday.length);

            for (var i = 0; i < bulletins.length; i++) {
                self.bulletinsClosedToday.push(bulletins[i]);
            }
        });
    }

    function refreshBulletins() {
        getOpenBulletins();
        getBulletinsClosedToday();
    }

    self.collapseBulletinsClosedToday = false;
    self.collapseBulletinsClosedTodayButtonTitle = 'Hide';

    self.doCollapseBulletinsClosedToday = function () {
        self.collapseBulletinsClosedToday = !self.collapseBulletinsClosedToday;

        if (self.collapseBulletinsClosedToday) {
            self.collapseBulletinsClosedTodayButtonTitle = 'Show';
        } else {
            self.collapseBulletinsClosedTodayButtonTitle = 'Hide';
        }
    };

    self.closeBulletin = function (id) {
        NewsBulletinsCloseService.get({ id: id }, function () {
            console.log('Closed bulletin', id);

            $timeout(refreshBulletins(), 1000);
        });
    };

    self.closeAllOpenBulletins = function () {
        console.log('Closing all open bulletins');

        for (var i = 0; i < self.openBulletins.length; i++) {
            self.closeBulletin(self.openBulletins[i].Id);
        }
    };

    refreshBulletins();

    // Event handlers

    $rootScope.$on('newBulletinReceivedEvent', function () {
        refreshBulletins();
    });
}]);
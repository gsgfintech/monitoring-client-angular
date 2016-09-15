'use strict';

angular.module('monitorApp')
    .controller('MenuCtrl', ['$rootScope', '$state', '$scope', '$stateParams', '$interpolate', 'MenuService', function ($rootScope, $state, $scope, $stateParams, $interpolate, MenuService) {

        var self = this;

        self.tabsSettings = MenuService.getTabsCounts();

        self.userName = null;

        if ($scope.userInfo && $scope.userInfo.profile) {
            self.userName = $scope.userInfo.profile.given_name;
        }

    }]);
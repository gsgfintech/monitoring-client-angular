'use strict';

angular.module('monitorApp')
    .controller('MenuCtrl', ['$rootScope', '$state', '$scope', '$stateParams', '$interpolate', 'MenuService', function ($rootScope, $state, $scope, $stateParams, $interpolate, MenuService) {

        var self = this;

        self.tabsSettings = MenuService.getTabsCounts();

        // Initial state
        //$state.go('alerts');
    }]);
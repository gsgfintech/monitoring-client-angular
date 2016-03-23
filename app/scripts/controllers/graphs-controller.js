'use strict';

angular.module('monitorApp')
.controller('GraphsCtrl', ['$stateParams', 'serverEnpoint', 'marketDataServiceEnpoint', function ($stateParams, serverEnpoint, marketDataServiceEnpoint) {

    var self = this;

    self.cross = $stateParams.cross;

    self.graphParams = {
        crosses: ['AUDUSD', 'EURUSD', 'GBPUSD', 'NZDUSD', 'USDCAD', 'USDCHF', 'USDJPY'],
        duration: 120, // in minutes
        marketDataEndpoint: marketDataServiceEnpoint,
        tradesEndpoint: serverEnpoint
    };

}]);
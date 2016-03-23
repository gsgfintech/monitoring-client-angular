'use strict';

angular.module('monitorApp')
.controller('GraphsCtrl', ['serverEnpoint', 'marketDataServiceEnpoint', function (serverEnpoint, marketDataServiceEnpoint) {

    var self = this;

    self.graphParams = {
        crosses: ['AUDUSD', 'EURUSD', 'GBPUSD', 'NZDUSD', 'USDCAD', 'USDCHF', 'USDJPY'],
        duration: 120, // in minutes
        marketDataEndpoint: marketDataServiceEnpoint,
        tradesEndpoint: serverEnpoint
    };

}]);
'use strict';

angular.module('monitorApp')
.factory('MenuService', [function () {

    var tabsCounts = {
        'activeTab': '',
        'alertsCount': 0,
        'ordersCount': 0,
        'tradesCount': 0,
        'newsBulletinsCount': 0,
        'tradeEnginesCount': 0,
        'dbLoggersCount': 0
    };

    return {
        getTabsCounts: function () {
            return tabsCounts;
        }
    };
}]);
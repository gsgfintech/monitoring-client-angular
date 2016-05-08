'use strict';

angular.module('monitorApp')
.controller('OrdersCtrl', ['$cacheFactory', '$scope', '$location', '$rootScope', '$state', '$stateParams', '$uibModal', 'FileSaver', 'OrdersService', 'OrderDetailsService', 'OrdersExcelService', 'MenuService', function ($cacheFactory, $scope, $location, $rootScope, $state, $stateParams, $uibModal, FileSaver, OrdersService, OrderDetailsService, OrdersExcelService, MenuService) {

    var self = this;

    function formatDate(date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = date.getDate().toString();
        return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]); // padding
    }

    var cache = $cacheFactory.get('ordersCtrl') || $cacheFactory('ordersCtrl');

    self.activeDate = cache.get('ordersCtrl.activeDate') || ($stateParams.date ? new Date($stateParams.date) : new Date());

    cache.put('ordersCtrl.activeDate', self.activeDate);

    var activeDateStr = formatDate(self.activeDate);

    $location.path('/orders/day/' + activeDateStr);
    $state.go('orders-day', { date: activeDateStr });

    self.orders = [];
    self.ordersCount = 0;

    self.crosses = '';
    self.crossFilter = '';

    self.downloading = false;

    self.changeDate = function () {
        cache.put('ordersCtrl.activeDate', self.activeDate);

        var activeDateStr = formatDate(self.activeDate);

        // Update path in address bar
        $location.path('/orders/day/' + activeDateStr);

        $state.go('orders-day', { date: activeDateStr });

        getOrders();
    };

    function getOrders() {
        OrdersService.query({ day: self.activeDate.toISOString() }, function (orders) {
            self.orders = orders;
            MenuService.getTabsCounts().ordersCount = orders.length;

            // Populate list of crosses
            self.crosses = '';

            for (var i = 0; i < orders.length; i++) {
                if (self.crosses.indexOf(orders[i].Cross) < 0) {
                    self.crosses = self.crosses + ',' + orders[i].Cross;
                }
            }
        });
    }

    self.listCrosses = function () {
        return self.crosses.split(',');
    };

    self.formatRate = function (cross, rate) {
        if (!rate) {
            return null;
        } else if (cross.indexOf('JPY') > -1) {
            return rate.toFixed(3);
        } else {
            return rate.toFixed(5);
        }
    };

    self.convertToPips = function (cross, value) {
        if (!value || !cross) {
            return null;
        } else if (cross.indexOf('JPY') > -1) {
            return (value * 100).toFixed(1) + ' pips';
        } else {
            return (value * 10000).toFixed(1) + ' pips';
        }
    };

    self.showOrderDetails = function (permanentId) {
        OrderDetailsService.get({ id: permanentId }, function (response) {
            if (response) {
                console.log('Received details of order', permanentId);

                $uibModal.open({
                    templateUrl: 'views/order-details-popup.html',
                    controller: 'OrderDetailsPopupCtrl as orderDetailsCtrl',
                    resolve: {
                        order: function () {
                            return response;
                        }
                    }
                });
            } else {
                console.error('Failed to load details of order', permanentId);
            }
        });
    };

    self.exportToExcel = function () {
        console.log('Requesting Excel file for', self.date);

        self.downloading = true;

        OrdersExcelService.download({
            day: self.activeDate.toISOString()
        }, function (result) {
            console.log('Received ', result.response.filename);

            var blob = result.response.blob;
            var filename = result.response.filename || 'export.xlsx';

            FileSaver.saveAs(blob, filename);

            self.downloading = false;
        });
    };

    self.shortenCross = function (cross) {
        return cross.replace('USD', '').replace('/', '');
    };

    self.shortenSide = function (side) {
        return side.substring(0, 1);
    };

    self.shortenType = function (type) {
        if (!type) {
            return null;
        } else if (type === 'MARKET') {
            return 'MKT';
        } else if (type === 'STOP') {
            return 'STP';
        } else if (type === 'LIMIT') {
            return 'LMT';
        } else if (type === 'TRAILING_STOP') {
            return 'TRAIL';
        } else {
            return type;
        }
    };

    self.shortenStatus = function (status) {
        if (!status) {
            return null;
        } else if (status === 'Submitted') {
            return 'Sbtd';
        } else if (status === 'Filled') {
            return 'Fld';
        } else if (status === 'Cancelled') {
            return 'Cxld';
        } else {
            return status;
        }
    };

    $rootScope.$on('orderUpdatedEvent', function (event, args) {
        var placedTime = new Date(args.placedTime);

        // Only reload if we're looking at today's trades
        if (placedTime.getDate() === self.activeDate.getDate()) {
            getOrders();
        }
    });

    getOrders();

}]);
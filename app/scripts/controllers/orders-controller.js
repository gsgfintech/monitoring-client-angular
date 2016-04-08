'use strict';

angular.module('monitorApp')
.controller('OrdersCtrl', ['$scope', '$rootScope', '$uibModal', 'FileSaver', 'OrdersService', 'OrderDetailsService', 'OrdersExcelService', 'MenuService', function ($scope, $rootScope, $uibModal, FileSaver, OrdersService, OrderDetailsService, OrdersExcelService, MenuService) {

    var self = this;

    self.date = new Date();

    self.orders = [];
    self.ordersCount = 0;

    self.crosses = '';
    self.crossFilter = '';

    self.downloading = false;

    self.getOrders = function () {
        OrdersService.query({ day: self.date.toISOString() }, function (orders) {
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
    };

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

    self.showOrderDetails = function (permanentId) {
        OrderDetailsService.get({ id: permanentId }, function (response) {
            if (response) {
                console.log('Received details of order', permanentId);

                $uibModal.open({
                    templateUrl: 'views/order-details.html',
                    controller: 'OrderDetailsCtrl as orderDetailsCtrl',
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
            day: self.date.toISOString()
        }, function (result) {
            console.log('Received ', result.response.filename);

            var blob = result.response.blob;
            var filename = result.response.filename || 'export.xlsx';

            FileSaver.saveAs(blob, filename);

            self.downloading = false;
        });
    };

    $rootScope.$on('orderUpdatedEvent', function (event, args) {
        var placedTime = new Date(args.placedTime);

        // Only reload if we're looking at today's trades
        if (placedTime.getDate() === self.date.getDate()) {
            self.getOrders();
        }
    });

    self.getOrders();

}]);
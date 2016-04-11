'use strict';

angular.module('monitorApp')
.controller('StratDatapointsCtrl', ['$window',
    'StratDatapointsStratnameService',
    'StratDatapointsService', 'StratDatapointsTradedService',
    'StratDatapointsExcelService', 'StratDatapointsTradedExcelService',
    'PopupService',
    function ($window,
        StratDatapointsStratnameService,
        StratDatapointsService, StratDatapointsTradedService,
        StratDatapointsExcelService, StratDatapointsTradedExcelService,
        PopupService) {

        var self = this;

        self.downloading = false;

        self.minDate = new Date(2015, 11, 1);
        self.maxDate = new Date();

        self.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        self.lowerBoundDate = new Date();
        self.upperBoundDate = new Date();

        self.lowerBoundDateOpen = false;
        self.upperBoundDateOpen = false;

        self.lowerBoundTime = new Date();
        self.upperBoundTime = new Date();

        self.start = null;
        self.end = null;

        self.stratNames = [];
        self.stratName = null;

        self.tradedOnly = false;

        self.datapoints = null;
        self.datapointsCount = 0;
        self.columnHeaders = null;

        StratDatapointsStratnameService.query(function (stratNames) {
            console.log('Received', stratNames.length, 'strats');

            self.stratNames.splice(0, self.stratNames.length);

            for (var i = 0; i < stratNames.length; i++) {
                var shortStratName = stratNames[i].split('_')[0];
                shortStratName = shortStratName.substring(0, shortStratName.length - 3);

                if (!isStratNameAlreadyInList(shortStratName)) {
                    self.stratNames.push(shortStratName + '_All');
                }

                self.stratNames.push(stratNames[i]);
            }
        });

        function isStratNameAlreadyInList(stratName) {
            for (var i = 0; i < self.stratNames.length; i++) {
                if (self.stratNames[i].indexOf(stratName) > -1) {
                    return true;
                }
            }

            return false;
        }

        self.open = function (bound) {
            if (bound === 'lowerDate') {
                self.lowerBoundDateOpen = true;
            } else if (bound === 'upperDate') {
                self.upperBoundDateOpen = true;
            }
        };

        self.formatTickType = function (numVal) {
            if (numVal === 1) {
                return 'BID';
            } else if (numVal === 2) {
                return 'ASK';
            } else {
                return null;
            }
        };

        self.exportToExcel = function () {
            self.downloading = true;

            computeStartAndEnd();

            console.log('Requesting Excel file for', self.stratName, 'from', self.start, 'to', self.end, '(traded only:', self.tradedOnly, ')');

            if (self.tradedOnly) {
                StratDatapointsTradedExcelService.download(getQueryParams(), filedDownloadedCb);
            } else {
                StratDatapointsExcelService.download(getQueryParams(), filedDownloadedCb);
            }
        };

        function getQueryParams() {
            return {
                stratname: self.stratName.split('_')[0],
                cross: self.stratName.split('_')[1],
                lowerBound: self.start,
                upperBound: self.end
            };
        }

        function filedDownloadedCb(result) {
            if (result.error) {
                console.error(result.error);
                PopupService.showError(result.error);
            } else {
                console.log('Received ', result.response.filename);

                var blob = result.response.blob;
                var filename = result.response.filename || 'export.xlsx';

                $window.saveAs(blob, filename);
            }

            self.downloading = false;
        }

        function computeStartAndEnd() {
            self.start = new Date(self.lowerBoundDate.getFullYear(), self.lowerBoundDate.getMonth(), self.lowerBoundDate.getDate(), self.lowerBoundTime.getHours(), self.lowerBoundTime.getMinutes()).toISOString();
            self.end = new Date(self.upperBoundDate.getFullYear(), self.upperBoundDate.getMonth(), self.upperBoundDate.getDate(), self.upperBoundTime.getHours(), self.upperBoundTime.getMinutes()).toISOString();
        }

    }]);
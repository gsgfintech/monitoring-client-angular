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

        self.loading = false;
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

        self.stratNames = StratDatapointsStratnameService.query();
        self.stratName = null;

        self.tradedOnly = false;

        self.datapoints = null;
        self.datapointsCount = 0;
        self.columnHeaders = null;

        self.open = function (bound) {
            if (bound === 'lowerDate') {
                self.lowerBoundDateOpen = true;
            } else if (bound === 'upperDate') {
                self.upperBoundDateOpen = true;
            }
        };

        self.loadData = function () {
            if (self.stratName.indexOf('NewCresusAlgo') > -1) { // NewCresusAlgo is handled separately: it will return matrices in an Excel workbook
                self.exportToExcel();
            }

            self.loading = true;

            computeStartAndEnd();

            console.log('Loading data for', self.stratName, 'from', self.start, 'to', self.end, '(traded only:', self.tradedOnly, ')');

            if (self.tradedOnly) {
                StratDatapointsTradedService.get(getQueryParams(), dataLoadedCb);
            } else {
                StratDatapointsService.get(getQueryParams(), dataLoadedCb);
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

        function dataLoadedCb(result) {
            console.log('Loaded', result.count, 'datapoints');
            self.datapoints = result.sample;
            self.datapointsCount = result.count;

            self.loading = false;
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
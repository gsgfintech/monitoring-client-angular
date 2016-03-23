'use strict';

angular.module('monitorApp')
.controller('MarketDataExcelCtrl', ['FileSaver', 'MarketDataExcelCrossesService', 'MarketDataExcelQueryService', 'MarketDataExcelExportService', function (FileSaver, MarketDataExcelCrossesService, MarketDataExcelQueryService, MarketDataExcelExportService) {

    var self = this;

    self.loading = false;
    self.downloading = false;

    self.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    self.lowerBoundDate = new Date();
    self.upperBoundDate = new Date();

    self.lowerBoundDateOpen = false;
    self.upperBoundDateOpen = false;

    self.lowerBoundTime = new Date();
    self.lowerBoundTime.setMilliseconds(0);
    self.lowerBoundTime.setSeconds(0);

    self.upperBoundTime = new Date();
    self.upperBoundTime.setMilliseconds(0);
    self.upperBoundTime.setSeconds(0);

    self.start = null;
    self.end = null;

    self.crosses = MarketDataExcelCrossesService.query();
    self.cross = null;

    self.ticks = null;
    self.ticksCount = 0;
    self.columnHeaders = null;

    self.open = function (bound) {
        if (bound === 'lowerDate') {
            self.lowerBoundDateOpen = true;
        } else if (bound === 'upperDate') {
            self.upperBoundDateOpen = true;
        }
    };

    self.loadData = function () {
        self.loading = true;

        self.start = new Date(self.lowerBoundDate.getFullYear(), self.lowerBoundDate.getMonth(), self.lowerBoundDate.getDate(), self.lowerBoundTime.getHours(), self.lowerBoundTime.getMinutes()).toISOString();
        self.end = new Date(self.upperBoundDate.getFullYear(), self.upperBoundDate.getMonth(), self.upperBoundDate.getDate(), self.upperBoundTime.getHours(), self.upperBoundTime.getMinutes()).toISOString();

        console.log('Loading data for', self.cross, 'from', self.start, 'to', self.end);

        MarketDataExcelQueryService.get({
            cross: self.cross,
            lowerBound: self.start,
            upperBound: self.end
        }, function (result) {
            console.log('Loaded ', result.count, 'ticks');
            self.ticks = result.sample;
            self.ticksCount = result.count;

            self.loading = false;
        });
    };

    self.exportToExcel = function () {
        console.log('Requesting Excel file for', self.cross, 'from', self.start, 'to', self.end);

        self.downloading = true;

        MarketDataExcelExportService.download({
            cross: self.cross,
            lowerBound: self.start,
            upperBound: self.end
        }, function (result) {
            console.log('Received', result.response.filename);

            var blob = result.response.blob;
            var filename = result.response.filename || 'export.xlsx';

            FileSaver.saveAs(blob, filename);

            self.downloading = false;
        });
    };

}]);
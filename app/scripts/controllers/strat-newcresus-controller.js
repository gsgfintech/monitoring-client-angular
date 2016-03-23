'use strict';

angular.module('monitorApp')
.controller('StratNewCresusCtrl', ['$rootScope', '$scope', 'FileSaver',
    'MonitoringAppService', 'PopupService',
    'StratDatapointsStratnameService',
    'StratDatapointsLatestService', 'StratDatapointsLatestExcelService',
    function ($rootScope, $scope, FileSaver,
        MonitoringAppService, PopupService,
        StratDatapointsStratnameService,
        StratDatapointsLatestService, StratDatapointsLatestExcelService) {

        var self = this;

        self.matrices = [];

        StratDatapointsStratnameService.query(function (stratnames) {
            if (stratnames.length > 0) {
                for (var i = 0; i < stratnames.length; i++) {
                    if (stratnames[i].indexOf('NewCresusAlgo') > -1) { // We're only interested in NewCresus matrices here
                        var stratname = 'NewCresusAlgo';
                        var cross = stratnames[i].split('_')[1];

                        StratDatapointsLatestService.get({
                            stratname: stratname,
                            cross: cross
                        }, handleDatapoints);
                    }
                }
            }
        });

        function handleDatapoints(result) {
            if (result.error) {
                console.error(result.error);
                PopupService.showError(result.error);
            } else {
                self.matrices.push(result.latest);
            }
        }
                        
        self.formatValue = function (value, cross) {
            // Format in pips:
            // x 100 for JPY crosses
            // x 10000 for other crosses
            if (cross.indexOf('JPY') > -1) {
                return value * 100;
            } else {
                return value * 10000;
            }
        };

        self.exportToExcel = function (matrix) {
            console.log('Exporting latest snapshot of', matrix.Strategy, matrix.Cross, 'to Excel');

            StratDatapointsLatestExcelService.download({
                stratname: matrix.Strategy,
                cross: matrix.Cross
            }, function (result) {
                console.log('Received ', result.response.filename);

                var blob = result.response.blob;
                var filename = result.response.filename || 'export.xlsx';

                FileSaver.saveAs(blob, filename);

                self.downloading = false;
            });
        };

        function getMatrixIndexByStratNameAndCross(stratName, cross) {
            for (var i = 0; i < self.matrices.length; i++) {
                if (self.matrices[i].Strategy === stratName && self.matrices[i].Cross === cross) {
                    return i;
                }
            }

            return -1;
        }

        // Event listeners
        $rootScope.$on('newAlgoDataPointReceivedEvent', function (event, args) {
            var dataPoint = args.dataPoint;

            if (!dataPoint.Strategy || !dataPoint.MidAvgDiffsMatrix) {
                // Ignore unrelated datapoints
                return;
            }

            var existingIndex = getMatrixIndexByStratNameAndCross(dataPoint.Strategy, dataPoint.Cross);

            if (existingIndex > -1) { // Update existing
                var existingMatrix = self.matrices[existingIndex].MidAvgDiffsMatrix;
                var updatedMatrix = dataPoint.MidAvgDiffsMatrix;

                for (var i = 0; i < existingMatrix.length; i++) {
                    for (var j = 0; j < existingMatrix[i].length; j++) {
                        existingMatrix[i][j] = updatedMatrix[i][j];
                    }
                }

                self.matrices[existingIndex].Timestamp = dataPoint.Timestamp;
            } else { // Add new
                self.matrices.push(dataPoint);
            }

            $scope.$apply();
        });

    }]);
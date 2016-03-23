'use strict';

angular.module('monitorApp')
.directive('amStockChart', [function () {
    return {
        template: '<div></div>',
        restrict: 'A',
        scope: {
            params: '=',
            height: '@',
            width: '@'
        },
        link: function (scope, element) {

            function buildDataSets(params) {
                var dataSets = [];

                function postProcess(data) {
                    for (var x in data) {
                        data[x] = {
                            type: 'sign',
                            graph: 'g1',
                            backgroundColor: data[x].Side === 'B' ? '#5cb85c' : '#d9534f',
                            date: new Date(data[x].ExecutionTime),
                            text: data[x].Side,
                            description: data[x].LongTradeString
                        };
                    }

                    return data;
                }

                for (var i = 0; i < params.crosses.length; i++) {
                    var cross = params.crosses[i];

                    dataSets.push({
                        'title': cross,
                        'fieldMappings': [
                            { 'fromField': 'MidOpen', 'toField': 'open' },
                            { 'fromField': 'MidHigh', 'toField': 'high' },
                            { 'fromField': 'MidLow', 'toField': 'low' },
                            { 'fromField': 'MidClose', 'toField': 'close' }
                        ],
                        'compared': false,
                        'categoryField': 'Timestamp',

                        'dataLoader': {
                            'url': params.marketDataEndpoint + 'api/marketdata/last/' + params.duration + '/' + cross,
                            'format': 'json',
                            'showCurtain': false,
                            'showErrors': true,
                            'async': true,
                            'reload': 10,
                        },

                        'eventDataLoader': {
                            'url': params.tradesEndpoint + 'api/executionsweb/graph/last/' + params.duration + '/' + cross,
                            'format': 'json',
                            'showCurtain': false,
                            'showErrors': true,
                            'async': true,
                            'postProcess': postProcess
                        }
                    });
                }

                return dataSets;
            }

            function buildPeriodSelector(params) {
                var duration = params.duration;
                var oneTenth = Math.round(duration / 10);
                var oneQuarter = Math.round(duration / 4);
                var half = Math.round(duration / 2);

                var periods = [];

                // 1/10th of the duration
                periods.push({
                    period: 'mm',
                    count: oneTenth,
                    label: oneTenth + ' mins'
                });

                // 1/4th of the duration
                periods.push({
                    period: 'mm',
                    count: oneQuarter,
                    label: oneQuarter + ' mins'
                });

                // 1/2th of the duration
                periods.push({
                    period: 'mm',
                    count: half,
                    label: half + ' mins'
                });

                // Max
                periods.push({
                    period: 'MAX',
                    label: duration + ' mins'
                });

                return { periods: periods };
            }

            function createStockChart(elemId, params) {
                AmCharts.makeChart(elemId, {
                    'type': 'stock',
                    'color': '#fff',
                    'dataSets': buildDataSets(params),

                    'panels': [
                        {
                            'title': 'Value',
                            'percentHeight': 100,

                            'stockGraphs': [{
                                'type': 'candlestick',
                                'id': 'g1',
                                'openField': 'open',
                                'closeField': 'close',
                                'highField': 'high',
                                'lowField': 'low',
                                'valueField': 'close',
                                'lineColor': '#5cb85c',
                                'fillColors': '#5cb85c',
                                'negativeLineColor': '#d9534f',
                                'negativeFillColors': '#d9534f',
                                'fillAlphas': 0.8,
                                'comparedGraphLineThickness': 2,
                                'columnWidth': 0.7,
                                'useDataSetColors': false,
                                'comparable': true,
                                'compareField': 'close',
                                'showBalloon': false,
                                'proCandlesticks': false
                            }],

                            'stockLegend': {
                                'valueTextRegular': 'O:[[open]] C:[[close]] H:[[high]] L:[[low]]',
                                'position': 'top'
                            }
                        }
                    ],

                    'panelsSettings': {
                        'color': '#fff',
                        'plotAreaFillColors': '#333',
                        'plotAreaFillAlphas': 1,
                        'marginLeft': 60,
                        'marginTop': 5,
                        'marginBottom': 5
                    },

                    'chartScrollbarSettings': {
                        'graph': 'g1',
                        'graphType': 'line',
                        'usePeriod': 'mm',
                        'backgroundColor': '#333',
                        'graphFillColor': '#666',
                        'graphFillAlpha': 0.5,
                        'gridColor': '#555',
                        'gridAlpha': 1,
                        'selectedBackgroundColor': '#444',
                        'selectedGraphFillAlpha': 1
                    },

                    'categoryAxesSettings': {
                        'equalSpacing': true,
                        'gridColor': '#555',
                        'gridAlpha': 1,
                        'minPeriod': 'ss'
                    },

                    'valueAxesSettings': {
                        'gridColor': '#555',
                        'gridAlpha': 1,
                        'inside': false,
                        'showLastLabel': true,
                        'color': 'black'
                    },

                    'chartCursorSettings': {
                        'zoomable': true,
                        'valueBalloonsEnabled': true,
                        'valueLineEnabled': true,
                        'valueLineBalloonEnabled': true,
                    },

                    'stockEventsSettings': {
                        'showAt': 'high',
                        'type': 'pin'
                    },

                    'balloon': {
                        'textAlign': 'left',
                        'offsetY': 10
                    },

                    'dataSetSelector': {
                        'position': 'left',
                        'selectText': 'Cross:'
                    },

                    'export': {
                        'enabled': true
                    },

                    'periodSelector': buildPeriodSelector(params)
                });
            }

            function getIdForUseInAmCharts() {
                var id = element[0].id; // try to use existing outer id to create new id

                if (!id) { //generate a UUID
                    var guid = function guid() {
                        function s4() {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                        }

                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                            s4() + '-' + s4() + s4() + s4();
                    };
                    id = guid();
                }

                return id;
            }

            var id = getIdForUseInAmCharts();

            element.attr('id', id);

            // set height and width
            var height = scope.height || '100%';
            var width = scope.width || '100%';

            element.css({
                'height': height,
                'width': width
            });

            createStockChart(id, scope.params);
        }
    };
}]);

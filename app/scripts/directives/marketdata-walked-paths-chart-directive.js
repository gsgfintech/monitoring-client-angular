'use strict';

angular.module('monitorApp')
.directive('walkedPathsChart', ['$rootScope', function ($rootScope) {
    return {
        template: '<div></div>',
        restrict: 'A',
        scope: {
            height: '@',
            width: '@'
        },
        link: function postLink(scope, element) {

            function buildEvents(events, day, graphId) {
                var formattedEvents = [];

                if (events) {
                    formattedEvents = events.map(function (event) {
                        var date = new Date(event.Timestamp);

                        function getBackgroundColor(eventLevel) {
                            if (eventLevel === 'LOW') {
                                return '#DFF0D8';
                            } else if (eventLevel === 'MEDIUM') {
                                return '#FAF2CC';
                            } else if (eventLevel === 'HIGH') {
                                return '#F2DEDE';
                            } else {
                                return '#C4E3F3';
                            }
                        }

                        return {
                            date: date,
                            showOnAxis: true,
                            type: 'text',
                            backgroundColor: getBackgroundColor(event.Level),
                            graph: graphId,
                            text: event.Currency,
                            description: event.Title + ' (' + AmCharts.formatDate(day, 'DD-MM-YY JJ:NN') + ' - ' + event.Level + ')'
                        };
                    });
                }

                return formattedEvents;
            }

            function buildDataSets(data, graphId) {
                var dataSets = [];

                for (var index in data.sets) {
                    var set = data.sets[index];

                    if (set.bids) {
                        dataSets.push({
                            title: AmCharts.formatDate(set.day, 'DDMMYY') + '-' + set.cross + '-Bids',
                            fieldMappings: [{
                                fromField: 'WalkedPath',
                                toField: 'value'
                            }],
                            dataProvider: set.bids,
                            categoryField: 'Time',
                            stockEvents: buildEvents(set.events, set.day, graphId)
                        });
                    }

                    if (set.asks) {
                        dataSets.push({
                            title: AmCharts.formatDate(set.day, 'DDMMYY') + '-' + set.cross + '-Asks',
                            fieldMappings: [{
                                fromField: 'WalkedPath',
                                toField: 'value'
                            }],
                            dataProvider: set.asks,
                            categoryField: 'Time',
                            stockEvents: buildEvents(set.events, set.day, graphId)
                        });
                    }
                }

                if (dataSets.length > 1) {
                    for (var i = 1; i < dataSets.length; i++) {
                        dataSets[i].compared = true;
                    }
                }

                return dataSets;
            }

            function createChart(id, data) {
                var graphId = 'g1';

                AmCharts.makeChart(id, {
                    type: 'stock',
                    theme: 'light',

                    categoryAxesSettings: {
                        minPeriod: 'mm'
                    },

                    dataSets: buildDataSets(data, graphId),

                    panels: [{
                        title: 'Walked Paths',
                        stockGraphs: [{
                            id: graphId,
                            valueField: 'value',
                            comparable: true,
                            balloonText: '[[title]]:<b>[[value]]</b>',
                            compareGraphBalloonText: '[[title]]:<b>[[value]]</b>',
                            showEventsOnComparedGraphs: true
                        }],
                        stockLegend: {
                            valueTextComparing: '[[value]]'
                        }
                    }],

                    panelsSettings: {
                        recalculateToPercents: 'never'
                    },

                    chartScrollbarSettings: {
                        graph: graphId,
                        usePeriod: '10mm',
                        position: 'top'
                    },

                    chartCursorSettings: {
                        valueBalloonsEnabled: true,
                        fullWidth: true,
                        cursorAlpha: 0.1,
                        valueLineBalloonEnabled: true,
                        valueLineEnabled: true,
                        valueLineAlpha: 0.5
                    },

                    periodSelector: {
                        position: 'top',
                        inputFieldsEnabled: false,
                        periods: [
                            { period: 'hh', count: 1, label: '1 hour' },
                            { period: 'hh', count: 2, label: '2 hours' },
                            { period: 'hh', count: 5, label: '5 hours' },
                            { period: 'hh', count: 12, label: '12 hours' },
                            { period: 'MAX', label: '1 day', selected: true }
                        ]
                    },

                    dataSetSelector: {
                        position: 'left'
                    }
                });

                $rootScope.$broadcast('walkedPathChart.rendered');
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

            // Event Handlers
            scope.$on('walkedPathChart.canRender', function (event, data) {
                console.log('Received event', event.name);

                createChart(id, data);
            });
        }
    };
}]);
